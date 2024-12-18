import { StageModel } from "./stage.model";

export interface CategoryModel {
    id: number;
    isSelected: boolean;
    isExpanded: boolean;
    name: string;
    stages: StageModel[];
}