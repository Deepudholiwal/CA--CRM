"use client";

import React, { useState, useMemo } from "react";
import { useDatabase } from "../../context/DatabaseContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import {
  CheckSquare,
  Search,
  Plus,
  ArrowRight,
  MessageSquare,
  Calendar as CalendarIcon,
  User,
  Filter,
  Paperclip,
  CheckCircle,
  FileCheck,
  Send,
  Loader
} from "lucide-react";

export default function TasksPage() {
  const {
    tasks,
    clients,
    employees,
    activeBranch,
    addTask,
    updateTaskStatus,
    addTaskComment,
    checkPermission
  } = useDatabase();

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // New Task Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedToId, setAssignedToId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const stages = [
    { key: "PENDING", title: "Pending", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20" },
    { key: "IN_PROGRESS", title: "In Progress", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" },
    { key: "REVIEW", title: "Review / Audit", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" },
    { key: "COMPLETED", title: "Completed", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" },
  ];

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const client = clients.find((c) => c.id === t.clientId);
      const matchBranch = activeBranch === "all" || !t.clientId || (client && client.branchId === activeBranch);
      
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;

      return matchBranch && matchSearch && matchPriority;
    });
  }, [tasks, clients, activeBranch, searchQuery, priorityFilter]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate || !assignedToId) return;

    const clientObj = clients.find((c) => c.id === clientId);
    const staffObj = employees.find((e) => e.id === assignedToId);

    addTask({
      title,
      description,
      clientId: clientId || "",
      clientName: clientObj ? clientObj.name : "Internal Firm Operation",
      priority,
      status: "PENDING",
      dueDate,
      assignedToId,
      assignedToName: staffObj ? staffObj.name : "Unassigned",
      createdById: "emp-1", // Logged in Partner
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setClientId("");
    setAssignedToId("");
    setDueDate("");
    setShowAddModal(false);
  };

  const handleOpenDetails = (task: any) => {
    setSelectedTask(task);
    setNewComment("");
    setShowDetailsModal(true);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;

    addTaskComment(selectedTask.id, newComment, "Deepak Yadav (Partner)");
    
    // Update active details modal state immediately
    const updatedTask = {
      ...selectedTask,
      comments: [
        ...selectedTask.comments,
        {
          id: `c-${Date.now()}`,
          employeeName: "Deepak Yadav (Partner)",
          comment: newComment,
          createdAt: "Just now"
        }
      ]
    };
    setSelectedTask(updatedTask);
    setNewComment("");
  };

  const handleMoveStatus = (taskId: string, nextStatus: string) => {
    updateTaskStatus(taskId, nextStatus);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: nextStatus });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center">
          <CheckSquare className="w-6 h-6 mr-2 text-primary" /> Task Board & Project Kanban
        </h2>
        <p className="text-xs text-muted-foreground">
          Delegate tax filings checklists, assign auditors, track execution stages, and review completed reports.
        </p>
      </div>

      {/* Control Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-xl shadow-sm">
        <div className="flex flex-1 items-center space-x-2 max-w-md">
          <div className="relative w-full">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center w-4 h-4 my-auto text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks, clients or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-card border border-border/60 rounded-lg px-2 py-1 text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center cursor-pointer shadow-sm ml-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageTasks = filteredTasks.filter((t) => t.status === stage.key);
          return (
            <div key={stage.key} className="flex-1 min-w-[260px] bg-muted/20 border border-border/40 rounded-xl p-3 flex flex-col h-[560px]">
              
              {/* Column Header */}
              <div className="flex justify-between items-center border-b border-border/40 pb-2 mb-3">
                <span className="text-xs font-bold text-foreground">{stage.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-card border border-border/60">
                  {stageTasks.length}
                </span>
              </div>

              {/* Column cards container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageTasks.length === 0 ? (
                  <div className="h-full border border-dashed border-border/40 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground p-3 text-center">
                    No active tasks
                  </div>
                ) : (
                  stageTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleOpenDetails(t)}
                      className="bg-card border border-border/80 rounded-lg p-3.5 space-y-3 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          t.priority === "CRITICAL"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse"
                            : t.priority === "HIGH"
                            ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                            : "bg-slate-500/10 text-slate-500"
                        }`}>
                          {t.priority}
                        </span>
                        
                        {/* Comments count */}
                        {t.comments.length > 0 && (
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <MessageSquare className="w-3.5 h-3.5 mr-1" /> {t.comments.length}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {t.title}
                      </h4>

                      <span className="text-[10px] text-muted-foreground font-semibold block truncate">
                        {t.clientName}
                      </span>

                      {/* Due date and assignee */}
                      <div className="flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center font-medium">
                          <CalendarIcon className="w-3 h-3 mr-1 text-slate-400" />
                          {new Date(t.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                        </span>
                        <div className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-primary bg-primary/10 rounded-full border border-primary/20 p-0.5" />
                          <span className="font-semibold text-foreground/80 truncate max-w-[80px]" title={t.assignedToName}>
                            {t.assignedToName.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create Compliance Assignment">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="GSTR-3B Reconciliation & Filing"
              className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conduct purchases reconciliation from GSTR-2B before logging returns..."
              className="w-full text-xs p-2.5 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Select Client Target</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">-- Internal Operation (No Client) --</option>
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
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Assign to Employee *</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                required
                className="w-full text-xs p-2 bg-card border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">-- Choose Operator --</option>
                {employees
                  .filter((emp) => activeBranch === "all" || emp.branchId === activeBranch)
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs p-2 border border-border/60 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 border-t border-border/40 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 border border-border/60 text-muted-foreground text-xs font-semibold rounded-lg hover:bg-muted cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Details & Comments Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg" title={`Task Workspace Detail`}>
        <div className="space-y-4 font-sans text-xs">
          
          <div className="flex justify-between items-start border-b border-border/40 pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground leading-snug">{selectedTask?.title}</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mt-1">Client: {selectedTask?.clientName}</span>
            </div>
            <div className="flex space-x-2 items-center">
              <Badge variant="secondary">{selectedTask?.priority} PRIORITY</Badge>
              <Badge variant="default">{selectedTask?.status}</Badge>
            </div>
          </div>

          {selectedTask?.description && (
            <div className="p-3 bg-muted/20 border border-border/40 rounded-lg">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mb-1">Scope Description</span>
              <p className="text-foreground/90 leading-relaxed font-medium">{selectedTask.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Assigned Team:</span>{" "}
              <span className="font-semibold text-foreground">{selectedTask?.assignedToName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>{" "}
              <span className="font-semibold text-red-500">{selectedTask?.dueDate}</span>
            </div>
          </div>

          {/* Action to change status */}
          <div className="flex items-center space-x-3 border-y border-border/20 py-3">
            <span className="font-bold text-muted-foreground uppercase text-[10px]">Transition Status:</span>
            {stages.map((st) => (
              <button
                key={st.key}
                disabled={selectedTask?.status === st.key}
                onClick={() => handleMoveStatus(selectedTask.id, st.key)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer border ${
                  selectedTask?.status === st.key
                    ? "bg-primary text-primary-foreground border-primary cursor-default opacity-90 shadow-sm"
                    : "bg-card text-foreground hover:bg-muted border-border/60"
                }`}
              >
                {st.title}
              </button>
            ))}
          </div>

          {/* Comments Section */}
          <div className="space-y-3.5">
            <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5 text-primary" /> Task Collaboration & Comments ({selectedTask?.comments.length || 0})
            </h4>

            {/* Previous messages */}
            <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
              {selectedTask?.comments.length === 0 ? (
                <p className="text-muted-foreground italic text-[10px]">No staff discussion logged yet.</p>
              ) : (
                selectedTask?.comments.map((c: any) => (
                  <div key={c.id} className="p-2.5 bg-muted/20 border border-border/40 rounded-lg text-xs leading-normal">
                    <div className="flex justify-between text-[9px] font-semibold text-slate-500 mb-1">
                      <span>{c.employeeName}</span>
                      <span>{c.createdAt}</span>
                    </div>
                    <p className="text-foreground/90 font-medium">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="flex space-x-2">
              <input
                type="text"
                placeholder="Post updates, request verification templates..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow text-xs px-3 py-2 border border-border/60 bg-muted/20 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white px-3.5 rounded-lg flex items-center justify-center cursor-pointer shadow shadow-primary/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </Modal>

    </div>
  );
}
