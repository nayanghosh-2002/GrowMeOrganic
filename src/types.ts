
export interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export interface Pagination {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
}

export interface ApiResponse {
    pagination: Pagination;
    data: Artwork[];
}

export interface SelectionState {
    selectedIds: Record<number, boolean>;
    crossPageCount: number;
}