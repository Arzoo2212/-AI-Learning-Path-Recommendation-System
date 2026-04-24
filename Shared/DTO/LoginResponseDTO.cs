using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
    public class LoginResponseDTO
    {
        public string? Token { get; set; }

        public UserDTO? UserDTO { get; set; }
    }
}
