import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Award {
    won: boolean;
    title: string;
    year: bigint;
}
export interface Portfolio {
    bio: string;
    projects: Array<Project>;
    awards: Array<Award>;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
}
export interface Project {
    title: string;
    year: bigint;
    description: string;
}
export interface backendInterface {
    addAward(title: string, year: bigint, won: boolean): Promise<void>;
    addProject(title: string, description: string, year: bigint): Promise<void>;
    getAwards(): Promise<Array<Award>>;
    getBio(): Promise<string>;
    getContactMessages(): Promise<Array<ContactMessage>>;
    getPortfolioByName(name: string): Promise<Portfolio>;
    getProjects(): Promise<Array<Project>>;
    initializePortfolios(): Promise<void>;
    submitContactMessage(name: string, email: string, message: string): Promise<void>;
    updateBio(newBio: string): Promise<void>;
}
