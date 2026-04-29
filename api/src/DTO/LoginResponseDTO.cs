using System;
using System.Collections.Generic;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class LoginResponseDTO
    {
        public string? Token { get; set; }

        public UserDTO? UserDTO { get; set; }
    }
}
