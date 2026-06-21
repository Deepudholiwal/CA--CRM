"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import {
  FolderClosed,
  FolderOpen,
  Search,
  Upload,
  Cpu,
  FileCheck,
  Calendar,
  Filter,
  Check,
  FileText,
  Download,
  AlertTriangle,
  FolderOpen as FolderOpenIcon,
  Trash2,
  Settings,
  ShieldAlert,
  Loader
} from "lucide-react";

export default function DocumentsPage() {
  const {
    clients,
    documents,
    activeBranch,
    addDocument,
    approveDocument,
    updateEsignStatus,
    runOCR
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Modal Detail States
  const [showDocDetails, setShowDocDetails] = useState(false);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);
  const [ocrRunning, setOcrRunning] = useState(false);

  // Uploader State
  const [uploadClientId, setUploadClientId] = useState("");
  const [uploadCategory, setUploadCategory] = useState("PAN");
  const [uploadFilename, setUploadFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");

  const folderCategories = [
    { name: "PAN", count: documents.filter((d) => d.category === "PAN").length },
    { name: "Aadhaar", count: documents.filter((d) => d.category === "AADHAAR").length },
    { name: "GST Certificates", count: documents.filter((d) => d.category === "GST_CERT").length },
    { name: "Bank Statements", count: documents.filter((d) => d.category === "BANK_STMT").length },
    { name: "Audit Reports", count: documents.filter((d) => d.category === "AUDIT_REP").length },
    { name: "ITR Acknowledgements", count: documents.filter((d) => d.category === "ITR_ACK").length },
  ];

  // Filters Documents
  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const client = clients.find((c) => c.id === d.clientId);
      const matchBranch = activeBranch === "all" || (client && client.branchId === activeBranch);
      
      const matchSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "all" || d.category === categoryFilter;
      const matchFolder = !selectedFolder || d.category === selectedFolder;

      return matchBranch && matchSearch && matchCategory && matchFolder;
    });
  }, [documents, clients, activeBranch, searchQuery, categoryFilter, selectedFolder]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      setUploadFilename(file.name.replace(/\.[^/.]+$/, "")); // Strip extension
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadClientId || !uploadFilename) return;

    const clientObj = clients.find((c) => c.id === uploadClientId);
    
    addDocument({
      clientId: uploadClientId,
      clientName: clientObj ? clientObj.name : "Internal",
      name: uploadFilename.endsWith(".pdf") ? uploadFilename : `${uploadFilename}.pdf`,
      fileUrl: `https://s3.aws.amazon.com/cafirm/cli-${uploadClientId}/${uploadFilename}.pdf`,
      fileSize: "1.8 MB",
      fileType: "pdf",
      category: uploadCategory,
    });

    setUploadFilename("");
    setSelectedFile("");
    alert("Document uploaded and saved to secure S3 storage bucket!");
  };

  const handleDocClick = (doc: any) => {
    setActiveDoc(doc);
    setShowDocDetails(true);
  };

  const executeOcrOnDoc = () => {
    if (!activeDoc) return;
    setOcrRunning(true);

    setTimeout(() => {
      setOcrRunning(false);
      let parsedData = {};
      if (activeDoc.category === "PAN") {
        parsedData = { pan: "AABCA1234F", name: activeDoc.clientName, docType: "PAN CARD" };
      } else if (activeDoc.category === "GST_CERT") {
        parsedData = { gstin: "06AABCA1234F1Z9", tradeName: activeDoc.clientName, dateOfRegistration: "15/08/2021" };
      } else {
        parsedData = { assessmentYear: "AY 2026-27", grossSalary: 1250000, tdsDeducted: 85000 };
      }
      
      runOCR(activeDoc.id, parsedData);
      setActiveDoc({ ...activeDoc, ocrData: parsedData });
    }, 1500);
  };

  const handleEsignTrigger = (docId: string, status: string) => {
    updateEsignStatus(docId, status);
    if (activeDoc && activeDoc.id === docId) {
      setActiveDoc({ ...activeDoc, esignStatus: status });
    }
    alert(`E-Sign request marked as ${status}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <FolderOpen className="w-6 h-6 mr-2 text-primary" /> Document Vault & Storage
        </h2>
        <p className="text-xs text-muted-foreground">
          Secure Cloudflare R2 / AWS S3 encrypted file storage. Extract properties with AI OCR and execute partner/client digital e-signatures.
        </p>
      </div>

      {/* Grid: Folder Directory vs Files Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Directory Folders */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Directory Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                  !selectedFolder ? "bg-primary/10 text-primary border-primary/20" : "bg-card border-border/40 hover:bg-muted"
                }`}
              >
                <span className="flex items-center"><FolderOpenIcon className="w-4 h-4 mr-2" /> All Vault Files</span>
                <span className="font-bold">{documents.length}</span>
              </button>

              {folderCategories.map((folder, idx) => {
                const mapCat = folder.name === "GST Certificates" ? "GST_CERT" : folder.name === "Bank Statements" ? "BANK_STMT" : folder.name === "Audit Reports" ? "AUDIT_REP" : folder.name === "ITR Acknowledgements" ? "ITR_ACK" : folder.name.toUpperCase();
                const isSelected = selectedFolder === mapCat;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedFolder(mapCat)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                      isSelected ? "bg-primary/10 text-primary border-primary/20" : "bg-card border-border/40 hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center"><FolderClosed className="w-4 h-4 mr-2 text-slate-400" /> {folder.name}</span>
                    <span className="font-bold text-muted-foreground">{folder.count}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Upload Form Box */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upload Document</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleUploadDocument} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Associate Client</label>
                  <select
                    required
                    value={uploadClientId}
                    onChange={(e) => setUploadClientId(e.target.value)}
                    className="w-full text-[11px] p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">-- Mapped Client --</option>
                    {clients
                      .filter((c) => activeBranch === "all" || c.branchId === activeBranch)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Category Folder</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full text-[11px] p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="PAN">PAN Cards</option>
                    <option value="AADHAAR">Aadhaar Cards</option>
                    <option value="GST_CERT">GST Certificates</option>
                    <option value="BANK_STMT">Bank Statements</option>
                    <option value="AUDIT_REP">Audit Reports</option>
                    <option value="ITR_ACK">ITR Acknowledgements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Select File *</label>
                  <div className="border border-dashed border-border/80 rounded-lg p-3 text-center hover:bg-muted/10 cursor-pointer relative bg-background">
                    <input
                      type="file"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-5 h-5 mx-auto text-primary mb-1" />
                    <span className="text-[10px] text-muted-foreground block font-semibold truncate">
                      {selectedFile ? `Selected: ${selectedFile}` : "Click to browse local files"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Filename *</label>
                  <input
                    type="text"
                    required
                    placeholder="PAN_Verma_Proprietor"
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    className="w-full text-[11px] p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary bg-card"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-1.5" /> Upload File
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Files Workspace directory */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar */}
          <div className="bg-card border border-border/40 p-3 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute inset-y-0 left-0 pl-2.5 flex items-center w-4 h-4 my-auto text-muted-foreground" />
              <input
                type="text"
                placeholder="Search file name or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-bold uppercase">
              <span>Cloud Storage status:</span>
              <Badge variant="success">96% Available</Badge>
            </div>
          </div>

          {/* Files Grid Table */}
          <Card className="px-0 py-2">
            {filteredDocs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No files uploaded in this folder category.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Client Associated</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>E-Sign status</TableHead>
                    <TableHead>Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => (
                    <TableRow
                      key={doc.id}
                      onClick={() => handleDocClick(doc)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-semibold text-xs text-primary truncate max-w-[180px]">{doc.name}</TableCell>
                      <TableCell className="text-xs truncate max-w-[150px]">{doc.clientName}</TableCell>
                      <TableCell className="text-xs font-semibold text-muted-foreground">{doc.category}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{doc.fileSize}</TableCell>
                      <TableCell>
                        <Badge variant={doc.esignStatus === "COMPLETED" ? "success" : doc.esignStatus === "SENT" ? "warning" : "secondary"} className="scale-90">
                          {doc.esignStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.isApproved ? "success" : "secondary"} className="scale-90">
                          {doc.isApproved ? "APPROVED" : "PENDING"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

        </div>

      </div>

      {/* Document details, OCR & E-Sign Approval Modal */}
      <Modal isOpen={showDocDetails} onClose={() => setShowDocDetails(false)} size="lg" title={`Secure file properties: ${activeDoc?.name}`}>
        <div className="space-y-4 font-sans text-xs">
          
          <div className="flex justify-between items-start border-b border-border/40 pb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground leading-snug">{activeDoc?.name}</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase mt-1 block">Associated: {activeDoc?.clientName}</span>
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary">{activeDoc?.fileSize}</Badge>
              <Badge variant={activeDoc?.isApproved ? "success" : "default"}>{activeDoc?.isApproved ? "Approved" : "Pending audit review"}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-border/20 pb-3">
            <div>
              <span className="text-muted-foreground block text-[10px]">AWS S3 Storage URL</span>
              <a href="#" className="text-primary hover:underline truncate block mt-0.5">{activeDoc?.fileUrl}</a>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Folder Category Mapping</span>
              <span className="font-semibold text-foreground block mt-0.5">{activeDoc?.category}</span>
            </div>
          </div>

          {/* E-Sign Actions panel */}
          <div className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[10px] text-muted-foreground uppercase">Digital signature validation</span>
              <Badge variant={activeDoc?.esignStatus === "COMPLETED" ? "success" : "warning"}>{activeDoc?.esignStatus}</Badge>
            </div>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => handleEsignTrigger(activeDoc.id, "SENT")}
                className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border/60 text-[10px] font-bold cursor-pointer"
              >
                Send Client E-Sign Request
              </button>
              <button
                onClick={() => handleEsignTrigger(activeDoc.id, "COMPLETED")}
                className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold flex items-center cursor-pointer"
              >
                Sign as Partner (E-Sign)
              </button>
              {!activeDoc?.isApproved && (
                <button
                  onClick={() => {
                    approveDocument(activeDoc.id);
                    setActiveDoc({ ...activeDoc, isApproved: true });
                    alert("Document approved successfully!");
                  }}
                  className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold flex items-center cursor-pointer ml-auto"
                >
                  Approve Schedule
                </button>
              )}
            </div>
          </div>

          {/* AI OCR Scanner section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-[10px] text-muted-foreground uppercase flex items-center">
                <Cpu className="w-4 h-4 mr-1.5 text-primary" /> AI OCR data extractor
              </h4>
              {!activeDoc?.ocrData && (
                <button
                  onClick={executeOcrOnDoc}
                  disabled={ocrRunning}
                  className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded flex items-center cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {ocrRunning ? <Loader className="w-3.5 h-3.5 mr-1 animate-spin" /> : "Run AI OCR Reader"}
                </button>
              )}
            </div>

            {ocrRunning && (
              <div className="p-4 border border-dashed border-border/80 text-center rounded-lg text-muted-foreground font-semibold">
                Parsing document tables...
              </div>
            )}

            {activeDoc?.ocrData && (
              <pre className="p-3.5 bg-slate-900/60 text-[10px] leading-relaxed font-mono rounded-lg border border-border/40 text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(activeDoc.ocrData, null, 2)}
              </pre>
            )}
          </div>

        </div>
      </Modal>

    </div>
  );
}
