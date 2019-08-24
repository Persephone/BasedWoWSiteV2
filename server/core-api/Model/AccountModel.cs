﻿using System.ComponentModel.DataAnnotations;

namespace server.Model
{
    public class AccountModel
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
