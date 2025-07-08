"use client";
import React, { useState, useEffect } from "react";
import HeaderSection from "./HeaderSection";
import NavigationTabs from "./NavigationTabs";
import SHGPortalView from "./SHGPortalView";
import AdminDashboardView from "./AdminDashboardView";
import Footer from "./Footer";
import Modal from "./Modal";

interface SHGMember {
  id: number;
  name: string;
  age: number;
  occupation: string;
  savings: number;
}
interface SHG {
  members: SHGMember[];
  products: string[];
  totalSavings: number;
}
interface Village {
  shgs: { [shgName: string]: SHG };
}
interface GramPanchayat {
  villages: { [villageName: string]: Village };
}
interface Block {
  gramPanchayats: { [gpName: string]: GramPanchayat };
}
interface District {
  blocks: { [blockName: string]: Block };
}
interface TripuraData {
  [districtName: string]: District;
}

interface TripuraSHGPortalProps {
  adminData: any;
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

export default function TripuraSHGPortal({
  adminData,
  isLoggedIn,
  userRole,
  onLogout,
  onShowLogin,
}: TripuraSHGPortalProps) {
  const [currentView] = useState("portal");

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedSHG, setSelectedSHG] = useState("");
  const [shgMembers, setShgMembers] = useState<SHGMember[]>([]);
  const [recentSHGs, setRecentSHGs] = useState<any[]>([]);
  const [showCreateSHG, setShowCreateSHG] = useState(false);
  const [newSHG, setNewSHG] = useState({
    name: "",
    clfId: "",
    voId: "",
    blockName: "",
    members: [{ name: "", phone: "" }],
  });
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    product: any;
    reason: string;
    type: string;
  }>({
    open: false,
    product: null,
    reason: "",
    type: "",
  });
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    product: any;
    type: string;
  }>({
    open: false,
    product: null,
    type: "",
  });
  const [confirmReject, setConfirmReject] = useState<{
    open: boolean;
    product: any;
  }>({
    open: false,
    product: null,
  });
  const [productStatuses, setProductStatuses] = useState<any>({});
  const [hiddenProductIds, setHiddenProductIds] = useState<number[]>([]);

  const [tripuraData] = useState<TripuraData>({
    DHALAI: {
      blocks: {
        Ambassa: {
          gramPanchayats: {
            "Ambassa GP": {
              villages: {
                "Ambassa Village": {
                  shgs: {
                    "Maa Durga SHG": {
                      members: [
                        {
                          id: 1,
                          name: "Sunita Devi",
                          age: 35,
                          occupation: "Farmer",
                          savings: 5000,
                        },
                        {
                          id: 2,
                          name: "Kamala Rani",
                          age: 42,
                          occupation: "Weaver",
                          savings: 7500,
                        },
                      ],
                      products: ["Handloom", "Bamboo Crafts"],
                      totalSavings: 12500,
                    },
                    "Lakshmi SHG": {
                      members: [
                        {
                          id: 3,
                          name: "Rekha Das",
                          age: 38,
                          occupation: "Tailor",
                          savings: 6000,
                        },
                        {
                          id: 4,
                          name: "Mina Tripura",
                          age: 29,
                          occupation: "Farmer",
                          savings: 4500,
                        },
                      ],
                      products: ["Textiles", "Organic Vegetables"],
                      totalSavings: 10500,
                    },
                  },
                },
              },
            },
          },
        },
        Kamalpur: {
          gramPanchayats: {
            "Kamalpur GP": {
              villages: {
                "Kamalpur Village": {
                  shgs: {
                    "Saraswati SHG": {
                      members: [
                        {
                          id: 5,
                          name: "Bharati Chakma",
                          age: 33,
                          occupation: "Artisan",
                          savings: 8000,
                        },
                      ],
                      products: ["Handicrafts"],
                      totalSavings: 8000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    GOMATI: {
      blocks: {
        Udaipur: {
          gramPanchayats: {
            "Udaipur GP": {
              villages: {
                "Udaipur Village": {
                  shgs: {
                    "Kali Mata SHG": {
                      members: [
                        {
                          id: 6,
                          name: "Pushpa Reang",
                          age: 40,
                          occupation: "Farmer",
                          savings: 9000,
                        },
                      ],
                      products: ["Rice Products"],
                      totalSavings: 9000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    if (
      isLoggedIn &&
      (userRole === "Member" || userRole === "SHG group Leader")
    ) {
      // Pick a random SHG group from tripuraData
      const districts = Object.keys(tripuraData);
      if (districts.length === 0) return;
      const district = districts[Math.floor(Math.random() * districts.length)];
      const blocks = Object.keys(tripuraData[district].blocks);
      if (blocks.length === 0) return;
      const block = blocks[Math.floor(Math.random() * blocks.length)];
      const gps = Object.keys(
        tripuraData[district].blocks[block].gramPanchayats
      );
      if (gps.length === 0) return;
      const gp = gps[Math.floor(Math.random() * gps.length)];
      const villages = Object.keys(
        tripuraData[district].blocks[block].gramPanchayats[gp].villages
      );
      if (villages.length === 0) return;
      const village = villages[Math.floor(Math.random() * villages.length)];
      const shgs = Object.keys(
        tripuraData[district].blocks[block].gramPanchayats[gp].villages[village]
          .shgs
      );
      if (shgs.length === 0) return;
      const shg = shgs[Math.floor(Math.random() * shgs.length)];
      setSelectedDistrict(district);
      setSelectedBlock(block);
      setSelectedGramPanchayat(gp);
      setSelectedVillage(village);
      setSelectedSHG(shg);
      setShgMembers(
        tripuraData[district].blocks[block].gramPanchayats[gp].villages[village]
          .shgs[shg].members || []
      );
    }
  }, [isLoggedIn, userRole]);

  const forceSHGSelection =
    isLoggedIn && (userRole === "Member" || userRole === "SHG group Leader");
  const forcedSHGValues = forceSHGSelection
    ? {
        district: selectedDistrict,
        block: selectedBlock,
        gramPanchayat: selectedGramPanchayat,
        village: selectedVillage,
        shg: selectedSHG,
      }
    : undefined;

  function selectDistrict(district: string) {
    setSelectedDistrict(district);
    setSelectedBlock("");
    setSelectedGramPanchayat("");
    setSelectedVillage("");
    setSelectedSHG("");
  }

  function selectBlock(block: string) {
    setSelectedBlock(block);
    setSelectedGramPanchayat("");
    setSelectedVillage("");
    setSelectedSHG("");
  }

  function selectGramPanchayat(gp: string) {
    setSelectedGramPanchayat(gp);
    setSelectedVillage("");
    setSelectedSHG("");
  }

  function selectVillage(village: string) {
    setSelectedVillage(village);
    setSelectedSHG("");
  }

  function selectSHG(shg: string) {
    setSelectedSHG(shg);
    const shgData =
      tripuraData[selectedDistrict]?.blocks[selectedBlock]?.gramPanchayats[
        selectedGramPanchayat
      ]?.villages[selectedVillage]?.shgs[shg];
    setShgMembers(shgData?.members || []);
  }

  function getBlocks() {
    return selectedDistrict
      ? Object.keys(tripuraData[selectedDistrict]?.blocks || {})
      : [];
  }

  function getGramPanchayats() {
    return selectedBlock
      ? Object.keys(
          tripuraData[selectedDistrict]?.blocks[selectedBlock]
            ?.gramPanchayats || {}
        )
      : [];
  }

  function getVillages() {
    return selectedGramPanchayat
      ? Object.keys(
          tripuraData[selectedDistrict]?.blocks[selectedBlock]?.gramPanchayats[
            selectedGramPanchayat
          ]?.villages || {}
        )
      : [];
  }

  function getSHGs() {
    return selectedVillage
      ? Object.keys(
          tripuraData[selectedDistrict]?.blocks[selectedBlock]?.gramPanchayats[
            selectedGramPanchayat
          ]?.villages[selectedVillage]?.shgs || {}
        )
      : [];
  }

  function handleAddMember() {
    setNewSHG((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", phone: "" }],
    }));
  }
  function handleRemoveMember(idx: number) {
    setNewSHG((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== idx),
    }));
  }
  function handleMemberChange(idx: number, field: string, value: string) {
    setNewSHG((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === idx ? { ...m, [field]: value } : m
      ),
    }));
  }
  function handleSHGFieldChange(field: string, value: string) {
    setNewSHG((prev) => ({ ...prev, [field]: value }));
  }
  function handleCreateSHG(e: React.FormEvent) {
    e.preventDefault();
    setRecentSHGs((prev) => [
      { ...newSHG, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setNewSHG({
      name: "",
      clfId: "",
      voId: "",
      blockName: "",
      members: [{ name: "", phone: "" }],
    });
    setShowCreateSHG(false);
  }

  function handleProductAction(
    productId: number,
    status: string,
    reason?: string
  ) {
    setProductStatuses((prev: any) => ({
      ...prev,
      [productId]: { status, reason: reason || "" },
    }));
    setHiddenProductIds((prev) => [...prev, productId]);
    setReviewModal({ open: false, product: null, reason: "", type: "" });
    setConfirmAction({ open: false, product: null, type: "" });
  }

  // Helper to collect all SHGs for DMMU view
  function getAllSHGsList() {
    const shgs: any[] = [];
    Object.entries(tripuraData).forEach(([district, dval]: any) => {
      Object.entries(dval.blocks).forEach(([block, bval]: any) => {
        Object.entries(bval.gramPanchayats).forEach(([gp, gpval]: any) => {
          Object.entries(gpval.villages).forEach(([village, vval]: any) => {
            Object.entries(vval.shgs).forEach(([shgName, shgData]: any) => {
              shgs.push({
                district,
                block,
                gramPanchayat: gp,
                village,
                name: shgName,
                ...shgData,
              });
            });
          });
        });
      });
    });
    return shgs;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <NavigationTabs
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={onLogout}
        onShowLogin={onShowLogin}
      />
      <main className="p-5 mx-4 my-5 bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        {/* Main Portal View always on top for DMMU, BMMU, CLF, VO */}
        {isLoggedIn &&
          ["DMMU", "BMMU", "CLF", "VO"].includes(userRole || "") && (
            <SHGPortalView
              tripuraData={tripuraData}
              selectedDistrict={selectedDistrict}
              selectedBlock={selectedBlock}
              selectedGramPanchayat={selectedGramPanchayat}
              selectedVillage={selectedVillage}
              selectedSHG={selectedSHG}
              shgMembers={shgMembers}
              selectDistrict={selectDistrict}
              selectBlock={selectBlock}
              selectGramPanchayat={selectGramPanchayat}
              selectVillage={selectVillage}
              selectSHG={selectSHG}
              getBlocks={getBlocks}
              getGramPanchayats={getGramPanchayats}
              getVillages={getVillages}
              getSHGs={getSHGs}
              disableDropdowns={forceSHGSelection || !isLoggedIn}
              forceSHGSelection={forceSHGSelection}
              forcedSHGValues={forcedSHGValues}
            />
          )}
        {/* Product Reviews for CLF and VO */}
        {isLoggedIn && ["CLF", "VO"].includes(userRole || "") && (
          <div className="mb-8 p-6 bg-stone-50 border border-zinc-300 rounded-lg">
            <h2 className="text-2xl font-bold text-neutral-500 mb-4">
              Product Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminData.products
                .filter(
                  (product: any) => !hiddenProductIds.includes(product.id)
                )
                .map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white border border-zinc-200 rounded-lg p-4 shadow flex flex-col gap-2"
                  >
                    <div className="font-semibold text-lg text-blue-700">
                      {product.name}
                    </div>
                    <div className="text-sm text-neutral-500">
                      Category: {product.category}
                    </div>
                    <div className="text-sm text-neutral-500">
                      SHG: {product.shg}
                    </div>
                    <div className="text-sm text-neutral-500">
                      Price: ₹{product.price}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {userRole === "CLF" ? (
                        <>
                          <button
                            className={`px-4 py-1 rounded font-semibold ${
                              productStatuses[product.id]?.status === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() =>
                              setConfirmAction({
                                open: true,
                                product,
                                type: "approve",
                              })
                            }
                          >
                            Approve
                          </button>
                          <button
                            className={`px-4 py-1 rounded font-semibold ${
                              productStatuses[product.id]?.status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() =>
                              setConfirmAction({
                                open: true,
                                product,
                                type: "reject",
                              })
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`px-4 py-1 rounded font-semibold ${
                              productStatuses[product.id]?.status ===
                              "recommended"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() =>
                              setConfirmAction({
                                open: true,
                                product,
                                type: "recommend",
                              })
                            }
                          >
                            Recommend
                          </button>
                          <button
                            className={`px-4 py-1 rounded font-semibold ${
                              productStatuses[product.id]?.status === "rejected"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                            onClick={() =>
                              setConfirmAction({
                                open: true,
                                product,
                                type: "reject",
                              })
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                    {productStatuses[product.id]?.status && (
                      <div className="mt-2 text-xs">
                        Status:{" "}
                        <span className="font-bold">
                          {productStatuses[product.id].status.replace("_", " ")}
                        </span>
                        {productStatuses[product.id].reason && (
                          <span className="ml-2 text-neutral-500">
                            Reason: {productStatuses[product.id].reason}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {/* Confirmation modal for Approve/Recommend/Reject (CLF/VO) */}
            <Modal
              isOpen={confirmAction.open}
              onClose={() =>
                setConfirmAction({ open: false, product: null, type: "" })
              }
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-2">
                  Are you sure you want to{" "}
                  {confirmAction.type === "approve"
                    ? "approve"
                    : confirmAction.type === "recommend"
                    ? "recommend"
                    : "reject"}{" "}
                  this product?
                </h3>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      setConfirmAction({ open: false, product: null, type: "" })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-1 rounded ${
                      confirmAction.type === "approve" ||
                      confirmAction.type === "recommend"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => {
                      if (
                        confirmAction.type === "approve" &&
                        confirmAction.product
                      ) {
                        handleProductAction(
                          confirmAction.product.id,
                          "approved"
                        );
                      } else if (
                        confirmAction.type === "recommend" &&
                        confirmAction.product
                      ) {
                        handleProductAction(
                          confirmAction.product.id,
                          "recommended"
                        );
                      } else {
                        setReviewModal({
                          open: true,
                          product: confirmAction.product,
                          reason: "",
                          type: confirmAction.type,
                        });
                      }
                    }}
                  >
                    Yes,{" "}
                    {confirmAction.type === "approve"
                      ? "Approve"
                      : confirmAction.type === "recommend"
                      ? "Recommend"
                      : "Reject"}
                  </button>
                </div>
              </div>
            </Modal>
            {/* Modal for Reason (Reject only) */}
            <Modal
              isOpen={reviewModal.open && reviewModal.type === "reject"}
              onClose={() =>
                setReviewModal({
                  open: false,
                  product: null,
                  reason: "",
                  type: "",
                })
              }
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto flex flex-col gap-4">
                <h3 className="text-2xl font-bold mb-2 text-center">
                  Reason for Rejecting
                </h3>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 text-base min-h-[100px] focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                  rows={4}
                  value={reviewModal.reason}
                  onChange={(e) =>
                    setReviewModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter reason..."
                />
                <div className="flex gap-4 justify-center mt-2">
                  <button
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                    onClick={() =>
                      setReviewModal({
                        open: false,
                        product: null,
                        reason: "",
                        type: "",
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={() =>
                      reviewModal.product &&
                      handleProductAction(
                        reviewModal.product.id,
                        "rejected",
                        reviewModal.reason
                      )
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Modal>
            {/* First confirmation modal for Reject (VO) */}
            <Modal
              isOpen={confirmReject.open}
              onClose={() => setConfirmReject({ open: false, product: null })}
            >
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-2">
                  Are you sure you want to reject this product?
                </h3>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() =>
                      setConfirmReject({ open: false, product: null })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      setReviewModal({
                        open: true,
                        product: confirmReject.product,
                        reason: "",
                        type: "reject",
                      })
                    }
                  >
                    Yes, Reject
                  </button>
                </div>
              </div>
            </Modal>
            {/* Modal for Reject Reason (VO) */}
            <Modal
              isOpen={reviewModal.open && reviewModal.type === "reject"}
              onClose={() =>
                setReviewModal({
                  open: false,
                  product: null,
                  reason: "",
                  type: "",
                })
              }
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto flex flex-col gap-4">
                <h3 className="text-2xl font-bold mb-2 text-center">
                  Reason for Rejecting
                </h3>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-4 text-base min-h-[100px] focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                  rows={4}
                  value={reviewModal.reason}
                  onChange={(e) =>
                    setReviewModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter reason..."
                />
                <div className="flex gap-4 justify-center mt-2">
                  <button
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                    onClick={() =>
                      setReviewModal({
                        open: false,
                        product: null,
                        reason: "",
                        type: "",
                      })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    onClick={() =>
                      reviewModal.product &&
                      handleProductAction(
                        reviewModal.product.id,
                        "rejected",
                        reviewModal.reason
                      )
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        )}
        {/* DMMU: List all dummy SHGs below FilterSection, below SHGPortalView */}
        {isLoggedIn && userRole === "DMMU" && (
          <div className="mb-8 p-6 bg-stone-50 border border-zinc-300 rounded-lg">
            <h2 className="text-2xl font-bold text-neutral-500 mb-4">
              All SHGs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-zinc-200 rounded-lg bg-white">
                <thead>
                  <tr className="bg-stone-50">
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      SHG Name
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      District
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Block
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Gram Panchayat
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Village
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Members
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Products
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getAllSHGsList().map((shg, idx) => (
                    <tr key={idx} className="border-t border-zinc-200">
                      <td className="p-3 text-neutral-700 font-medium">
                        {shg.name}
                      </td>
                      <td className="p-3 text-neutral-700">{shg.district}</td>
                      <td className="p-3 text-neutral-700">{shg.block}</td>
                      <td className="p-3 text-neutral-700">
                        {shg.gramPanchayat}
                      </td>
                      <td className="p-3 text-neutral-700">{shg.village}</td>
                      <td className="p-3 text-neutral-700">
                        {shg.members && shg.members.length > 0
                          ? shg.members.map((m: any, i: number) => (
                              <div key={i}>{m.name}</div>
                            ))
                          : "-"}
                      </td>
                      <td className="p-3 text-neutral-700">
                        {shg.products && shg.products.length > 0
                          ? shg.products.join(", ")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* BMMU: Create SHG Section below FilterSection, below SHGPortalView */}
        {isLoggedIn && userRole === "BMMU" && (
          <div className="mb-8 p-6 bg-stone-50 border border-zinc-300 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-neutral-500">
                Create New SHG
              </h2>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
                onClick={() => setShowCreateSHG((v) => !v)}
              >
                {showCreateSHG ? "Cancel" : "Create SHG"}
              </button>
            </div>
            {showCreateSHG && (
              <form onSubmit={handleCreateSHG} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SHG Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newSHG.name}
                      onChange={(e) =>
                        handleSHGFieldChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CLF ID
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newSHG.clfId}
                      onChange={(e) =>
                        handleSHGFieldChange("clfId", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VO ID
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newSHG.voId || ""}
                      onChange={(e) =>
                        handleSHGFieldChange("voId", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={newSHG.blockName}
                      onChange={(e) =>
                        handleSHGFieldChange("blockName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Members
                  </label>
                  {newSHG.members.map((member, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <input
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(idx, "name", e.target.value)
                        }
                        required
                      />
                      <input
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        placeholder="Phone Number"
                        value={member.phone}
                        onChange={(e) =>
                          handleMemberChange(idx, "phone", e.target.value)
                        }
                        required
                      />
                      {newSHG.members.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 font-bold px-2"
                          onClick={() => handleRemoveMember(idx)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    onClick={handleAddMember}
                  >
                    + Add Member
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Create
                </button>
              </form>
            )}
          </div>
        )}
        {/* Recently Created SHG Section (BMMU only) */}
        {isLoggedIn && userRole === "BMMU" && recentSHGs.length > 0 && (
          <div className="mb-8 p-6 bg-white border border-zinc-300 rounded-lg">
            <h2 className="text-2xl font-bold text-neutral-500 mb-4">
              Recently Created SHGs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-zinc-200 rounded-lg bg-stone-50">
                <thead>
                  <tr className="bg-white">
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      SHG Name
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      CLF ID
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Block Name
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Members
                    </th>
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSHGs.map((shg, idx) => (
                    <tr key={idx} className="border-t border-zinc-200">
                      <td className="p-3 text-neutral-700 font-medium">
                        {shg.name}
                      </td>
                      <td className="p-3 text-neutral-700">{shg.clfId}</td>
                      <td className="p-3 text-neutral-700">{shg.blockName}</td>
                      <td className="p-3 text-neutral-700">
                        {shg.members.map((m: any, i: number) => (
                          <div key={i}>
                            {m.name} ({m.phone})
                          </div>
                        ))}
                      </td>
                      <td className="p-3 text-neutral-700 text-xs">
                        {new Date(shg.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Main Portal View for all other roles (not DMMU, BMMU, CLF, VO) */}
        {isLoggedIn &&
        !["DMMU", "BMMU", "CLF", "VO"].includes(userRole || "") &&
        currentView === "portal" ? (
          <SHGPortalView
            tripuraData={tripuraData}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            selectedGramPanchayat={selectedGramPanchayat}
            selectedVillage={selectedVillage}
            selectedSHG={selectedSHG}
            shgMembers={shgMembers}
            selectDistrict={selectDistrict}
            selectBlock={selectBlock}
            selectGramPanchayat={selectGramPanchayat}
            selectVillage={selectVillage}
            selectSHG={selectSHG}
            getBlocks={getBlocks}
            getGramPanchayats={getGramPanchayats}
            getVillages={getVillages}
            getSHGs={getSHGs}
            disableDropdowns={forceSHGSelection || !isLoggedIn}
            forceSHGSelection={forceSHGSelection}
            forcedSHGValues={forcedSHGValues}
          />
        ) : null}
        {isLoggedIn &&
        !["DMMU", "BMMU", "CLF", "VO"].includes(userRole || "") &&
        currentView !== "portal" ? (
          <AdminDashboardView
            adminData={adminData}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
          />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
