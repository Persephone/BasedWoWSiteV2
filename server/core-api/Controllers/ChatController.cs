﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using server.ApiExtensions;
using server.Data.Website;
using server.Services.Ravendb;
using server.Services.SignalR;
using server.Services.SignalR.Chat;
using server.Util;

namespace server.Controllers
{
    [Authorize]
    [Route("/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<SignalRHub, ISignalRHub> _signalRHub;
        private readonly IGroupChatService _groupChatService;

        public ChatController(UserManager<ApplicationUser> userManager, IHubContext<SignalRHub, ISignalRHub> chatHub, IDocumentStoreHolder documentStore, 
            IGroupChatService groupChatService)
        {
            _userManager = userManager;
            _signalRHub = chatHub;
            _groupChatService = groupChatService;
        }

        [HttpGet("GetGroupChats")]
        public async Task<IActionResult> GetGroupChats()
        {
            var user = await TokenHelper.GetUser(User, _userManager);
            if (user == null)
                return RequestHandler.Unauthorized();

            var groupChats = await _groupChatService.GetGroupChatsByMemberIdAsync(user.Id.ToString());

            await GetMemberDetails(groupChats);

            return Ok(groupChats);
        }

        [HttpPost("CreateGroupChat")]
        public async Task<IActionResult> CreateGroupChat([FromBody] GroupChatMember otherMember)
        {
            var user = await TokenHelper.GetUser(User, _userManager);
            if (user == null)
                return RequestHandler.Unauthorized();

            if (user.Id.ToString() == otherMember.Id)
                return RequestHandler.BadRequest("You can't start a chat with yourself");

            var groupChat = await _groupChatService.GetExistingGroupChatAsync(user.Id.ToString(), otherMember.Id);
            if (groupChat != null)
                return RequestHandler.BadRequest($"You are already in a group chat with {otherMember.Name}");

            groupChat = new GroupChat();

            groupChat.Members.Add(new GroupChatMember
            {
                Id = user.Id.ToString(),
                Name = user.UserName,
                Email = user.Email,
            });

            groupChat.Members.Add(otherMember);

            await _groupChatService.SaveGroupChatAsync(groupChat);

            foreach (var member in groupChat.Members)
            {
                var clients = SignalRMemberService.GetConnectionsByUser(member.Id);
                if (clients == null)
                    continue;

                foreach (var connectionId in clients)
                {
                    await _signalRHub.Groups.AddToGroupAsync(connectionId, groupChat.Id);

                    if (member.Id == user.Id.ToString())
                        await _signalRHub.Clients.Client(connectionId).GroupChatUpdated(groupChat);
                    else
                        await _signalRHub.Clients.Client(connectionId).GroupChatCreated(groupChat, user.UserName);
                }
            }

            return Ok(groupChat);
        }

        [HttpGet("SearchUsers/{query}")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            var members = await
                _userManager.Users.Where(x => x.UserName.Contains(query)
                                              || x.Email.Contains(query)
                                              || x.Firstname.Contains(query))
                    .Select(x => new GroupChatMember
                    {
                        Id = x.Id.ToString(),
                        Email = x.Email,
                        Name = x.UserName
                    })
                    .ToListAsync();

            var count = members.Count();

            return Ok(new
            {
                members = members.Take(25),
                count
            });
        }

        private async Task GetMemberDetails(IEnumerable<GroupChat> groupChats)
        {
            var authorCache = new Dictionary<string, (string name, string email)>();

            foreach (var chat in groupChats)
            {
                foreach (var member in chat.Members)
                {
                    var userId = member.Id;
                    if (authorCache.TryGetValue(userId, out var cache))
                    {
                        member.Name = cache.name;
                        member.Email = cache.email;
                        continue;
                    }

                    var user = await _userManager.FindByIdAsync(userId);
                    if (user == null)
                        continue;

                    var authorName = user.UserName.Capitalize();
                    member.Name = authorName;
                    member.Email = user.Email;
                    authorCache.Add(userId, (authorName, user.Email));
                }
            }
        }
    }
}