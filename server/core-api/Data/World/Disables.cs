﻿using System;
using System.Collections.Generic;

namespace server.Data.World
{
    public partial class Disables
    {
        public int SourceType { get; set; }
        public int Entry { get; set; }
        public short Flags { get; set; }
        public string Params0 { get; set; }
        public string Params1 { get; set; }
        public string Comment { get; set; }
    }
}
