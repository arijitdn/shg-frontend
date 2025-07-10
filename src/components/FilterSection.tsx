interface FilterSectionProps {
  tripuraData: any;
  selectedDistrict: string;
  selectedBlock: string;
  selectedGramPanchayat: string;
  selectedVillage: string;
  selectedSHG: string;
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
}

export default function FilterSection({
  tripuraData,
  selectedDistrict,
  selectedBlock,
  selectedGramPanchayat,
  selectedVillage,
  selectedSHG,
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
}: FilterSectionProps) {
  return (
    <section className="p-5 mb-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mx-0 mt-0 mb-4 text-neutral-500">Filter SHGs</h3>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-sm:grid-cols-[1fr]">
        <div>
          <label
            htmlFor="district-select"
            className="mb-1.5 text-xs text-neutral-500"
          >
            District
          </label>
          <select
            id="district-select"
            className="p-2 w-full text-xs rounded border border-solid border-zinc-300"
            value={selectedDistrict}
            onChange={(event) => selectDistrict(event.target.value)}
            disabled={disableDropdowns}
          >
            <option value="">Select District</option>
            {Object.keys(tripuraData)?.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="block-select"
            className="mb-1.5 text-xs text-neutral-500"
          >
            Block
          </label>
          <select
            id="block-select"
            className="p-2 w-full text-xs rounded border border-solid border-zinc-300"
            value={selectedBlock}
            disabled={disableDropdowns || !selectedDistrict}
            onChange={(event) => selectBlock(event.target.value)}
            style={{
              opacity: !selectedDistrict || disableDropdowns ? 0.5 : 1,
            }}
          >
            <option value="">Select Block</option>
            {getBlocks()?.map((block) => (
              <option key={block} value={block}>
                {block}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="gp-select"
            className="mb-1.5 text-xs text-neutral-500"
          >
            Gram Panchayat
          </label>
          <select
            id="gp-select"
            className="p-2 w-full text-xs rounded border border-solid border-zinc-300"
            value={selectedGramPanchayat}
            disabled={disableDropdowns || !selectedBlock}
            onChange={(event) => selectGramPanchayat(event.target.value)}
            style={{
              opacity: !selectedBlock || disableDropdowns ? 0.5 : 1,
            }}
          >
            <option value="">Select Gram Panchayat</option>
            {getGramPanchayats()?.map((gp) => (
              <option key={gp} value={gp}>
                {gp}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="village-select"
            className="mb-1.5 text-xs text-neutral-500"
          >
            Village
          </label>
          <select
            id="village-select"
            className="p-2 w-full text-xs rounded border border-solid border-zinc-300"
            value={selectedVillage}
            disabled={disableDropdowns || !selectedGramPanchayat}
            onChange={(event) => selectVillage(event.target.value)}
            style={{
              opacity: !selectedGramPanchayat || disableDropdowns ? 0.5 : 1,
            }}
          >
            <option value="">Select Village</option>
            {getVillages()?.map((village) => (
              <option key={village} value={village}>
                {village}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="shg-select"
            className="mb-1.5 text-xs text-neutral-500"
          >
            SHG Group
          </label>
          <select
            id="shg-select"
            className="p-2 w-full text-xs rounded border border-solid border-zinc-300"
            value={selectedSHG}
            disabled={disableDropdowns || !selectedVillage}
            onChange={(event) => selectSHG(event.target.value)}
            style={{
              opacity: !selectedVillage || disableDropdowns ? 0.5 : 1,
            }}
          >
            <option value="">Select SHG</option>
            {getSHGs()?.map((shg) => (
              <option key={shg} value={shg}>
                {shg}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
