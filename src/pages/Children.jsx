import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiAlertTriangle, FiHeart, FiUserCheck, FiFilter, FiX } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import ToastContainer from "../components/Toast";
import { SkeletonTable } from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { childrenService } from "../services/childrenService";
import { classNames } from "../utils/formatters";

const summaryConfig = [
  { label: "Total Children", key: "total",      icon: FiUsers,        color: "bg-civic-50 text-civic-700 ring-1 ring-civic-200 dark:bg-civic-500/10 dark:text-civic-300 dark:ring-civic-500/20" },
  { label: "High Risk",      key: "highRisk",   icon: FiAlertTriangle, color: "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20" },
  { label: "Adopted",        key: "adopted",    icon: FiHeart,        color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20" },
  { label: "Needs Review",   key: "needsReview", icon: FiUserCheck,   color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20" },
];

const AGE_MIN = 0;
const AGE_MAX = 18;

export default function Children() {
  const [query, setQuery]           = useState("");
  const [data, setData]             = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 0 });
  const [summary, setSummary]       = useState({ total: 0, highRisk: 0, adopted: 0, needsReview: 0 });
  const [loading, setLoading]       = useState(true);

  // Age range filter state
  const [ageMin, setAgeMin]               = useState("");
  const [ageMax, setAgeMax]               = useState("");
  const [showAgeFilter, setShowAgeFilter] = useState(false);

  const navigate = useNavigate();
  const { user }  = useAuth();
  const { toasts, error: showError, removeToast } = useToast();

  const isOrphanageUser = user?.role === "orphanage";
  const basePath = user?.role === "admin" ? "/admin" : "/orphanage";

  // Define columns based on user role - orphanage column only for admin users
  const columns = [
    { key: "childCode",  label: "Child ID" },
    { key: "name",       label: "Name" },
    { key: "age",        label: "Age ↑" },
    ...(isOrphanageUser ? [] : [{ key: "orphanage", label: "Orphanage" }]),
    { key: "risk",       label: "Risk" },
    { key: "health",     label: "Health" },
    { key: "attendance", label: "Attendance" },
  ];

  const isAgeFilterActive = ageMin !== "" || ageMax !== "";

  const loadChildren = async (page = 1, searchQuery = query, minAge = ageMin, maxAge = ageMax) => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        page,
        limit: 8,
        sortBy: "approximateAge",
        sortOrder: "asc",
        ...(minAge !== "" ? { ageMin: Number(minAge) } : {}),
        ...(maxAge !== "" ? { ageMax: Number(maxAge) } : {}),
      };

      const response = await childrenService.getAll(params);

      // childrenService.getAll returns unwrapped response: { data, pagination, summary }
      // Handle both wrapped and unwrapped responses
      const payload = response?.data && typeof response?.data === "object" && !Array.isArray(response?.data)
        ? response.data
        : response;

      // Filter and sort client-side as safety net for computed age
      const rawData = Array.isArray(payload?.data) ? payload.data : [];
      let list = [...rawData];
      if (minAge !== "") {
        list = list.filter((c) => Number(c.age) >= Number(minAge));
      }
      if (maxAge !== "") {
        list = list.filter((c) => Number(c.age) <= Number(maxAge));
      }
      const sorted = list.sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0));

      setData(sorted);
      setPagination(payload?.pagination ?? { page: 1, limit: 8, total: 0, totalPages: 0 });
      setSummary(payload?.summary   ?? { total: 0, highRisk: 0, adopted: 0, needsReview: 0 });
    } catch (err) {
      showError(err.message || "Failed to load children");
      console.error("Error loading children:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      loadChildren(1, query, ageMin, ageMax);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  // Age filter debounce
  useEffect(() => {
    const t = setTimeout(() => {
      loadChildren(1, query, ageMin, ageMax);
    }, 400);

    return () => clearTimeout(t);
  }, [ageMin, ageMax]);

  const handlePageChange = (newPage) => {
    loadChildren(newPage);
  };

  const handleRowClick = (child) => {
    navigate(`${basePath}/children/${child.id}`);
  };

  const clearAgeFilter = () => {
    setAgeMin("");
    setAgeMax("");
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Breadcrumb items={["Records", "Children"]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="page-title">Child Records</h1>
            <p className="page-subtitle">
              {isOrphanageUser
                ? "Children in your care home"
                : "Centralised welfare and AI risk monitoring list"}
            </p>
          </div>
        </div>

        {/* Search + Filter row */}
        <div className="flex items-center gap-2 sm:max-w-md w-full sm:w-auto">
          <SearchBar value={query} onChange={setQuery} placeholder="Search by name, ID or risk…" className="flex-1" />

          {/* Age filter toggle button */}
          <button
            onClick={() => setShowAgeFilter((v) => !v)}
            title="Filter by age range"
            className={classNames(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all",
              showAgeFilter || isAgeFilterActive
                ? "border-civic-500 bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400 dark:border-civic-500"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
            )}
          >
            <FiFilter className="h-4 w-4" />
            {isAgeFilterActive && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-civic-500 ring-1 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Age Range Filter Panel */}
      <AnimatePresence>
        {showAgeFilter && (
          <motion.div
            key="age-filter"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-end gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-center gap-2 self-center">
                <FiFilter className="h-4 w-4 text-civic-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Filter by Age</span>
              </div>

              {/* Min age input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Min Age</label>
                <input
                  type="number"
                  min={AGE_MIN}
                  max={AGE_MAX}
                  value={ageMin}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || (Number(v) >= AGE_MIN && Number(v) <= AGE_MAX)) setAgeMin(v);
                  }}
                  placeholder="0"
                  className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm outline-none focus:border-civic-400 focus:ring-2 focus:ring-civic-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-civic-500/20"
                />
              </div>

              {/* Sliders */}
              <div className="flex flex-1 flex-col gap-2 min-w-[180px]">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Range:&nbsp;
                  <span className="font-bold text-civic-600 dark:text-civic-400">
                    {ageMin !== "" ? ageMin : AGE_MIN} – {ageMax !== "" ? ageMax : AGE_MAX} yrs
                  </span>
                </label>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="range"
                    min={AGE_MIN}
                    max={AGE_MAX}
                    value={ageMin !== "" ? Number(ageMin) : AGE_MIN}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      const maxV = ageMax !== "" ? Number(ageMax) : AGE_MAX;
                      if (v <= maxV) setAgeMin(String(v));
                    }}
                    className="w-full accent-civic-500 cursor-pointer"
                  />
                  <input
                    type="range"
                    min={AGE_MIN}
                    max={AGE_MAX}
                    value={ageMax !== "" ? Number(ageMax) : AGE_MAX}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      const minV = ageMin !== "" ? Number(ageMin) : AGE_MIN;
                      if (v >= minV) setAgeMax(String(v));
                    }}
                    className="w-full accent-civic-500 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>{AGE_MIN} yrs</span><span>{AGE_MAX} yrs</span>
                </div>
              </div>

              {/* Max age input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Max Age</label>
                <input
                  type="number"
                  min={AGE_MIN}
                  max={AGE_MAX}
                  value={ageMax}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || (Number(v) >= AGE_MIN && Number(v) <= AGE_MAX)) setAgeMax(v);
                  }}
                  placeholder="18"
                  className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm outline-none focus:border-civic-400 focus:ring-2 focus:ring-civic-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-civic-500/20"
                />
              </div>

              {/* Clear button */}
              {isAgeFilterActive && (
                <button
                  onClick={clearAgeFilter}
                  className="flex items-center gap-1.5 self-end rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  <FiX className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter badge */}
      <AnimatePresence>
        {isAgeFilterActive && (
          <motion.div
            key="age-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <span className="flex items-center gap-1.5 rounded-full border border-civic-200 bg-civic-50 px-3 py-1 text-xs font-semibold text-civic-700 dark:border-civic-500/30 dark:bg-civic-500/10 dark:text-civic-300">
              <FiFilter className="h-3 w-3" />
              Age: {ageMin !== "" ? ageMin : "0"} – {ageMax !== "" ? ageMax : "18"} yrs
              <button onClick={clearAgeFilter} className="ml-1 rounded-full hover:text-red-500 transition">
                <FiX className="h-3 w-3" />
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {summaryConfig.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={classNames("flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-sm border border-slate-200/60 dark:border-slate-800", s.color)}>
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-75 font-display">{s.label}</p>
                <p className="mt-0.5 text-xl font-bold tabular-nums leading-none font-display">{summary[s.key] || 0}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="section-card"
      >
        {loading ? (
          <SkeletonTable rows={8} cols={columns.length} />
        ) : data.length === 0 ? (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><FiUsers className="h-6 w-6 text-slate-400" /></div>
            <p className="empty-state-title">No Children Found</p>
            <p className="empty-state-desc">
              {isAgeFilterActive
                ? `No children found aged ${ageMin || 0}–${ageMax || 18}. Try widening the range.`
                : query
                ? "Try adjusting your search query"
                : isOrphanageUser
                ? "No children registered yet in your care home"
                : "No children registered yet"}
            </p>
            {isAgeFilterActive && (
              <button
                onClick={clearAgeFilter}
                className="mt-3 rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Clear age filter
              </button>
            )}
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data}
              onRowClick={handleRowClick}
            />
            {pagination.totalPages > 1 && (
              <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}