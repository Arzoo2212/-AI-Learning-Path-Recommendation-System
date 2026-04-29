using System;
using System.Collections.Generic;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class AddUserSkillDTO
    {
        public int UserId { get; set; }

        public List<SkillLevelDTO> Skills { get; set; } = new();
    }
}
