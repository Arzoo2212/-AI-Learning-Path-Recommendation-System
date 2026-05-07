namespace AI_Course_Recommendation_System.DTO
{
    public class SkillGapDTO
    {
        public string SkillName { get; set; } = string.Empty;

        public int CurrentLevel { get; set; }

        public int RequiredLevel { get; set; }

        public int Gap { get; set; }
        public string Priority { get; set; } = string.Empty;
    }
}
