﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class SkillDiscoveryTemplate
    {
        public int SpellId { get; set; }
        public int ReqSpell { get; set; }
        public short ReqSkillValue { get; set; }
        public float Chance { get; set; }
    }
}
