using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
    public class UserSkillResponseDTO
    {
        public string UserName { get; set; }

        public List<SkillLevelResponseDTO> Skills { get; set; } = new();
    }
}
