import { ProjectTechnologyDTO } from "./ProjectTechnology";
import { ProjectBodyDTO } from "./ProjectTranslation";

export interface ProjectDTO {
  id: string;
  imageSrc: string;
  projectUrl: string;
  year: string;
  status: string;
  imagePosition: string;
  translations: ProjectBodyDTO[];
  userId: string;
  technologies: ProjectTechnologyDTO[];
  technologyIds: string[];
}
