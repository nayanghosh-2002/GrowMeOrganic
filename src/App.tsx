import React, { useRef, useState } from 'react';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useArtworks } from './useArtworks';

const App: React.FC = () => {
    const { 
        artworks, 
        loading, 
        totalRecords, 
        page, 
        setPage, 
        selectedArtworks, 
        onRowSelectChange, 
        submitCustomSelection,
        selectionCount 
    } = useArtworks();

    const op = useRef<OverlayPanel>(null);
    const [customRowInput, setCustomRowInput] = useState<number | null>(null);

    
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="flex align-items-center gap-2">
                    <Button 
                        type="button" 
                        icon="pi pi-chevron-down" 
                        label="Select Custom Rows" 
                        onClick={(e) => op.current?.toggle(e)} 
                        className="p-button-outlined p-button-sm"
                    />
                    {selectionCount > 0 && (
                        <span className="text-sm text-600 font-semibold">
                           {selectionCount} rows selected
                        </span>
                    )}
                </div>

                <OverlayPanel ref={op} showCloseIcon>
                    <div className="flex flex-column gap-3" style={{ width: '300px' }}>
                        <span className="font-bold text-lg">Select Rows</span>
                        <p className="m-0 text-sm text-600 line-height-3">
                            Select rows across pages automatically.
                        </p>
                        
                        
                        <div className="flex align-items-center gap-2">
                            <InputNumber 
                                value={customRowInput} 
                                onValueChange={(e) => setCustomRowInput(e.value ?? null)} 
                                placeholder="Count..." 
                                min={0}
                                max={totalRecords}
                                className="flex-1" 
                                inputClassName="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => {
                                    if (customRowInput !== null) {
                                        submitCustomSelection(customRowInput);
                                        op.current?.hide();
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    const onPageHandler = (event: DataTableStateEvent) => {
        const newPage = (event.page ?? 0) + 1;
        setPage(newPage);
    };

    return (
        <div className="card p-4">
            <DataTable
                value={artworks}
                loading={loading}
                header={renderHeader()}
                dataKey="id"
                paginator
                lazy
                first={(page - 1) * 12}
                rows={12} 
                totalRecords={totalRecords}
                onPage={onPageHandler}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                selection={selectedArtworks}
                onSelectionChange={onRowSelectChange}
                selectionMode="multiple"
                
                size="small"
                stripedRows
                showGridlines
                tableStyle={{ minWidth: '60rem' }} 
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                
                <Column 
                    field="title" 
                    header="TITLE" 
                    style={{ width: '25%', fontWeight: '600' }}
                ></Column>
                
                <Column 
                    field="place_of_origin" 
                    header="PLACE OF ORIGIN"
                    style={{ width: '15%' }}
                ></Column>
                
                <Column 
                    field="artist_display" 
                    header="ARTIST"
                    style={{ width: '20%' }}
                ></Column>
                
                <Column 
                    field="inscriptions" 
                    header="INSCRIPTIONS" 
                    style={{ 
                        width: '20%', 
                        maxWidth: '200px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                    }} 
                ></Column>
                
                <Column 
                    field="date_start" 
                    header="START"
                    style={{ width: '10%' }}
                ></Column>
                
                <Column 
                    field="date_end" 
                    header="END"
                    style={{ width: '10%' }}
                ></Column>
            </DataTable>
        </div>
    );
};

export default App;