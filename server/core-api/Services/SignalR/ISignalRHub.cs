﻿using System.Threading.Tasks;
using server.Data.Auth;
using server.Data.Website;
using server.Model.Website;
using server.Services.SignalR.Chat;

namespace server.Services.SignalR
{
    public interface ISignalRHub
    {
        Task UpdateOnlineUsers(WebsiteClient[] userCount, int visitorCount);
        Task UpdateUserInformations(UserInformationResponse response, int count);
        Task ReceiveShoutBoxMessage(Shout shout);
        Task ClearShoutBox();
        Task EditShout(Shout shout);
        Task DeleteShout(string id);
        Task ValidateVersion(string version);
        Task SynchronizeAccountData(AccountData data);

        /* CHAT SYSTEM */
        Task SendMessage(ChatMessage message);
        Task GroupChatCreated(GroupChat groupChat, string createdBy);
        Task GroupChatUpdated(GroupChat groupChat);
        Task GroupChatRemoved(string id, string leaverName);
    }
}
