﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace server.Model.Account
{
    public class UpdateAccountAccessModel
    {
        [Required]
        public int AccountId { get; set; }

        [Required]
        public List<AccessData> AccessData { get; set; }
    }
}
