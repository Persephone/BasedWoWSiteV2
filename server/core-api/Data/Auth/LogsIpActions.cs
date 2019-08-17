﻿using System;

namespace server.Data.Auth
{
    public partial class LogsIpActions
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int CharacterGuid { get; set; }
        public byte Type { get; set; }
        public string Ip { get; set; }
        public string Systemnote { get; set; }
        public int Unixtime { get; set; }
        public DateTimeOffset Time { get; set; }
        public string Comment { get; set; }
    }
}
