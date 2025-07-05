export interface Talk {
    id: number;
    title: string;
    speaker_name: string;
    speaker_email: string;
    speaker_bio?: string;
    description: string;
    duration: number;
    level: string;
    track: string;
    created_at: Date;
    updated_at?: Date;
}
export interface TalkFilters {
    speaker_name?: string;
    level?: string;
    track?: string;
    duration?: number;
    min_duration?: number;
    max_duration?: number;
}
export declare class DatabaseService {
    private pool;
    constructor();
    testConnection(): Promise<boolean>;
    getAllTalks(): Promise<Talk[]>;
    getTalksWithFilters(filters: TalkFilters): Promise<Talk[]>;
    searchTalksByTitle(searchTerm: string, exactMatch?: boolean): Promise<Talk[]>;
    close(): Promise<void>;
}
export declare const dbService: DatabaseService;
