﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class SpellBonusData
    {
        public int Entry { get; set; }
        public float DirectBonus { get; set; }
        public float DotBonus { get; set; }
        public float ApBonus { get; set; }
        public float ApDotBonus { get; set; }
        public string Comments { get; set; }
    }
}
