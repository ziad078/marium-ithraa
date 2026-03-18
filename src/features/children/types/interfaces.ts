import { Organization } from "@/features/organizations";
import { User } from "@/features/users";
import { Gender } from "@/lib/types/enums";


export interface Child {
    id: string;

    name: string;

    grade: string;

    birthDate: string;

    gender: Gender;

    organization: Organization;

    user: User;

    profile: ChildProfile;

    created_at: string;

    updated_at: string;
}



export interface ChildReport {
    id: string;

    // assignment: TestAssignment;
    assignment: unknown;

    score_json: string;

    created_at: string;
}
export interface ChildProfile {
    id: string;

    child: Child;

    diagnoses: string;

    notes: string;

    status: string;
}