﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class PetLevelstats
    {
        public int CreatureEntry { get; set; }
        public byte Level { get; set; }
        public short Hp { get; set; }
        public short Mana { get; set; }
        public int Armor { get; set; }
        public short Str { get; set; }
        public short Agi { get; set; }
        public short Sta { get; set; }
        public short Inte { get; set; }
        public short Spi { get; set; }
        public short MinDmg { get; set; }
        public short MaxDmg { get; set; }
    }
}
