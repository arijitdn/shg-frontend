import React from "react";
import FilterSection from "./FilterSection";
import MemberTable from "./MemberTable";

interface SHGPortalViewProps {
  tripuraData: any;
  selectedDistrict: string;
  selectedBlock: string;
  selectedGramPanchayat: string;
  selectedVillage: string;
  selectedSHG: string;
  shgMembers: any[];
  selectDistrict: (district: string) => void;
  selectBlock: (block: string) => void;
  selectGramPanchayat: (gp: string) => void;
  selectVillage: (village: string) => void;
  selectSHG: (shg: string) => void;
  getBlocks: () => string[];
  getGramPanchayats: () => string[];
  getVillages: () => string[];
  getSHGs: () => string[];
  disableDropdowns?: boolean;
  forceSHGSelection?: boolean;
  forcedSHGValues?: {
    district: string;
    block: string;
    gramPanchayat: string;
    village: string;
    shg: string;
  };
}

export default function SHGPortalView({
  tripuraData,
  selectedDistrict,
  selectedBlock,
  selectedGramPanchayat,
  selectedVillage,
  selectedSHG,
  shgMembers,
  selectDistrict,
  selectBlock,
  selectGramPanchayat,
  selectVillage,
  selectSHG,
  getBlocks,
  getGramPanchayats,
  getVillages,
  getSHGs,
  disableDropdowns = false,
  forceSHGSelection = false,
  forcedSHGValues,
}: SHGPortalViewProps) {
  return (
    <div>
      <div className="pb-4 mb-5 border-b-2 border-solid border-b-zinc-300">
        <h1 className="m-0 text-2xl font-[bold] text-neutral-500">
          Tripura Self Help Groups Portal
        </h1>
      </div>
      <FilterSection
        tripuraData={tripuraData}
        selectedDistrict={
          forceSHGSelection && forcedSHGValues
            ? forcedSHGValues.district
            : selectedDistrict
        }
        selectedBlock={
          forceSHGSelection && forcedSHGValues
            ? forcedSHGValues.block
            : selectedBlock
        }
        selectedGramPanchayat={
          forceSHGSelection && forcedSHGValues
            ? forcedSHGValues.gramPanchayat
            : selectedGramPanchayat
        }
        selectedVillage={
          forceSHGSelection && forcedSHGValues
            ? forcedSHGValues.village
            : selectedVillage
        }
        selectedSHG={
          forceSHGSelection && forcedSHGValues
            ? forcedSHGValues.shg
            : selectedSHG
        }
        selectDistrict={forceSHGSelection ? () => {} : selectDistrict}
        selectBlock={forceSHGSelection ? () => {} : selectBlock}
        selectGramPanchayat={forceSHGSelection ? () => {} : selectGramPanchayat}
        selectVillage={forceSHGSelection ? () => {} : selectVillage}
        selectSHG={forceSHGSelection ? () => {} : selectSHG}
        getBlocks={getBlocks}
        getGramPanchayats={getGramPanchayats}
        getVillages={getVillages}
        getSHGs={getSHGs}
        disableDropdowns={disableDropdowns}
      />
      {selectedSHG && shgMembers.length > 0 && (
        <MemberTable selectedSHG={selectedSHG} shgMembers={shgMembers} />
      )}
    </div>
  );
}
