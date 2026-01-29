import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { ApiResponse, Artwork, SelectionState } from './types';

export const useArtworks = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    
    
    const [selectionModel, setSelectionModel] = useState<SelectionState>({
        selectedIds: {},
        crossPageCount: 0
    });

    
    const fetchArtworks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>(
                `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
            );
            setArtworks(response.data.data);
            setTotalRecords(response.data.pagination.total);
        } catch (error) {
            console.error("Failed to fetch artworks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(page);
    }, [page]);

    
    const selectedArtworks = useMemo(() => {
        const currentSelection: Artwork[] = [];
        
        artworks.forEach((row, index) => {
            const globalIndex = (page - 1) * 12 + index; 
            const isImplicitlySelected = globalIndex < selectionModel.crossPageCount;
            const explicitStatus = selectionModel.selectedIds[row.id];

            
            if (explicitStatus === true) {
                currentSelection.push(row);
            } else if (explicitStatus === undefined && isImplicitlySelected) {
                currentSelection.push(row);
            }
        });

        return currentSelection;
    }, [artworks, selectionModel, page]);

    
    const onRowSelectChange = (e: { value: Artwork[] }) => {
        const newSelectedRows = e.value;
        const newSelectedIds = { ...selectionModel.selectedIds };

        
        const currentPageIds = new Set(artworks.map(a => a.id));
        const selectedIdSet = new Set(newSelectedRows.map(a => a.id));

        artworks.forEach((row, index) => {
            
            if (currentPageIds.has(row.id)) {
                
                const globalIndex = (page - 1) * 12 + index;
                const isImplicitlySelected = globalIndex < selectionModel.crossPageCount;
                const isSelectedByUser = selectedIdSet.has(row.id);

                if (isSelectedByUser) {
                    
                    if (isImplicitlySelected) {
                        
                        delete newSelectedIds[row.id]; 
                    } else {
                        
                        newSelectedIds[row.id] = true;
                    }
                } else {
                    
                    if (isImplicitlySelected) {
                        
                        newSelectedIds[row.id] = false;
                    } else {
                        
                        delete newSelectedIds[row.id];
                    }
                }
            }
        });

        setSelectionModel(prev => ({
            ...prev,
            selectedIds: newSelectedIds
        }));
    };

    const submitCustomSelection = (count: number) => {
        setSelectionModel({
            selectedIds: {}, 
            crossPageCount: count 
        });
    };

    
    const selectionCount = useMemo(() => {
        
        let count = selectionModel.crossPageCount;

       
        const manualAdds = Object.values(selectionModel.selectedIds).filter(val => val === true).length;
        
        
        const manualRemoves = Object.values(selectionModel.selectedIds).filter(val => val === false).length;

        return count + manualAdds - manualRemoves;
    }, [selectionModel]);

    return {
        artworks,
        loading,
        totalRecords,
        page,
        setPage,
        selectedArtworks,
        onRowSelectChange,
        submitCustomSelection,
        selectionCount 
    };
};