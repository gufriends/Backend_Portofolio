import { ProjectTranslationDTO } from "./ProjectTranslation";
import { TechnologyDTO } from "./Technology";

export interface ProjectDTO {
  id: string;
  imageSrc: string;
  projectUrl: string;
  year: string;
  status: string;
  imagePosition: string;
  userId?: string;
  translations: ProjectTranslationDTO[];
  technologies: TechnologyDTO[];
}
