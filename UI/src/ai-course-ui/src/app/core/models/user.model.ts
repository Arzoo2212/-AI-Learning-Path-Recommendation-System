export interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  experienceLevel: number;
  careerGoal: string;
  createdAt: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  currentLevel: number;
  requiredLevel: number; // Made required, not optional
}

export interface SkillGap {
  skill: Skill;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface UserSkillDTO {
  skillName: string;
  currentLevel: number;
}

export interface UserSkillResponseDTO {
  userName: string;
  skills: UserSkillDTO[];
}
