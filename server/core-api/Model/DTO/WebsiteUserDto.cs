﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Model.DTO
{
    public class WebsiteUserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public List<string> ConnectionList { get; set; }
    }
}
