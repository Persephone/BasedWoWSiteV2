﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Model.Website
{
    public class UpdateChangelogModel
    {
        public int Id { get; set; }
        public byte Category { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
