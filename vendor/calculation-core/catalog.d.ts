export type Wave = 'P0' | 'P1' | 'P2';
export interface ModalityVariant {
    id: string;
    name: string;
    subgroup?: string;
}
export interface ModalityDefinition {
    id: string;
    delphiIndex: number | null;
    name: string;
    group: string;
    wave: Wave;
    variants?: ModalityVariant[];
}
export declare function listModalities(): ModalityDefinition[];
export declare function getModality(id: string): ModalityDefinition;
export declare function resolveModalityId(id: string): {
    parentId: string;
    variantId?: string;
};
export declare function catalogVersion(): string;
//# sourceMappingURL=catalog.d.ts.map