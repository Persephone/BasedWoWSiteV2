﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class GameobjectLootTemplate
    {
        public int Entry { get; set; }
        public int Item { get; set; }
        public int Reference { get; set; }
        public float Chance { get; set; }
        public byte QuestRequired { get; set; }
        public short LootMode { get; set; }
        public byte GroupId { get; set; }
        public byte MinCount { get; set; }
        public byte MaxCount { get; set; }
        public string Comment { get; set; }
    }
}
