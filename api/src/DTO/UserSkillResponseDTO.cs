using System;
using System.Collections.Generic;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class UserSkillResponseDTO
    {
        public string UserName { get; set; }

        public List<SkillLevelResponseDTO> Skills { get; set; } = new();
    }
}
