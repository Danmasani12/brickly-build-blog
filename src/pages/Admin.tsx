import { useState, useEffect, useRef, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  LogOut,
  UserPlus,
  Grid,
  Image,
  Home,
  Trash2,
  Edit2,
  Search,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GalleryPostForm } from "@/components/admin/GalleryPostForm";
import { RealtyPostForm } from "@/components/admin/RealtyPostForm";

interface GalleryPost {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface RealtyPost {
  id: string;
  title: string;
  location: string;
  price: string;
  created_at: string;
}

/* --- Small reusable stat card (dark) --- */
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: any;
}) => (
  <div className="flex items-center gap-4 p-4 bg-gray-900 border border-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
    <div className="p-3 rounded-md bg-slate-800/60 text-sky-300">
      {icon}
    </div>
    <div>
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-gray-100">{value}</div>
    </div>
  </div>
);

/* --- Sidebar --- */
const Sidebar = ({
  active,
  onNavigate,
  onCreate,
  onLogout,
}: {
  active: string;
  onNavigate: (section: string) => void;
  onCreate: () => void;
  onLogout: (event?: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const itemClass = (id: string) =>
    `w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 ${
      active === id
        ? "bg-slate-800 text-sky-300"
        : "text-slate-300 hover:bg-slate-800/50 hover:text-sky-200"
    }`;

  return (
    <aside className="w-72 min-h-screen sticky top-0 left-0 hidden lg:flex flex-col bg-gray-950 border-r border-slate-800 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Lion<span className="text-yellow-300">Cage</span></h2>
        <p className="text-sm text-slate-400 mt-1">Administrator</p>
      </div>

      <nav className="flex-1 space-y-1">
        <button className={itemClass("overview")} onClick={() => onNavigate("overview")}>
          <Grid className="w-5 h-5" /> <span>Overview</span>
        </button>
        <button className={itemClass("posts")} onClick={() => onNavigate("posts")}>
          <Image className="w-5 h-5" /> <span>Gallery Posts</span>
        </button>
        <button className={itemClass("realty")} onClick={() => onNavigate("realty")}>
          <Home className="w-5 h-5" /> <span>Realty</span>
        </button>
        <button className={itemClass("create")} onClick={() => onNavigate("create")}>
          <Plus className="w-5 h-5" /> <span>Create</span>
        </button>
      </nav>

      {/* logout in sidebar bottom */}
      <div className="hidden lg:block px-6 mt-6">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white"
          onClick={(e: MouseEvent<HTMLButtonElement>) => onLogout(e)}
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </aside>
  );
};

/* --- Main component --- */
const Admin = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // state (kept same as your original logic)
  const [postType, setPostType] = useState<"gallery" | "realty" | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([]);
  const [realtyPosts, setRealtyPosts] = useState<RealtyPost[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; type: "gallery" | "realty" } | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingType, setEditingType] = useState<"gallery" | "realty" | null>(null);

  const [galleryPage, setGalleryPage] = useState(1);
  const [realtyPage, setRealtyPage] = useState(1);
  const postsPerPage = 6;

  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"overview" | "posts" | "realty" | "create">("overview");

  const formRef = useRef<HTMLDivElement | null>(null);

  /* --- Life cycle --- */
  useEffect(() => {
    fetchPosts();
    checkSuperAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSuperAdminStatus = async () => {
    try {
      const res = await fetch("/api/admin/status/", { credentials: "include" });
      const data = await res.json();
      setIsSuperAdmin(data?.is_super_admin || false);
    } catch (error) {
      console.error("Failed to check admin status:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const [galleryRes, realtyRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/gallery`),
        fetch(`${import.meta.env.VITE_API_URL}/api/realty`),
      ]);
      const [galleryData, realtyData] = await Promise.all([
        galleryRes.json(),
        realtyRes.json(),
      ]);
      setGalleryPosts(galleryData || []);
      setRealtyPosts(realtyData || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  localStorage.removeItem("user"); // if you store a generic user key too

  // Optionally, clear refresh tokens if used
  localStorage.removeItem("refreshToken");

  navigate("/admin-login", { replace: true });
};

  const handlePostTypeChange = (value: string) => {
    setPostType(value as "gallery" | "realty");
    setEditingPost(null);
    setEditingType(null);
    setIsOpen(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSuccess = () => {
    setPostType("");
    setIsOpen(false);
    setEditingPost(null);
    setEditingType(null);
    fetchPosts();
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      const endpoint =
        postToDelete.type === "gallery"
          ? `${import.meta.env.VITE_API_URL}/api/gallery/${postToDelete.id}/`
          : `${import.meta.env.VITE_API_URL}/api/realty/${postToDelete.id}/`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete post");

      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to delete post");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCreateJuniorAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      if (!res.ok) throw new Error("Failed to create junior admin");

      toast.success("Junior admin created successfully");
      setNewAdmin({ name: "", email: "", password: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create junior admin");
    }
  };

  const paginate = (posts: any[], page: number) => {
    const start = (page - 1) * postsPerPage;
    return posts.slice(start, start + postsPerPage);
  };

  const galleryTotalPages = Math.max(1, Math.ceil(galleryPosts.length / postsPerPage));
  const realtyTotalPages = Math.max(1, Math.ceil(realtyPosts.length / postsPerPage));

  const filteredGallery = galleryPosts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  const filteredRealty = realtyPosts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()));

  /* --- animation variants --- */
  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <Sidebar
            active={activeSection}
            onNavigate={(s) => setActiveSection(s as any)}
            onCreate={() => {
              setPostType("");
              setIsOpen(true);
              setActiveSection("create");
              setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
            }}
            onLogout={handleLogout}
          />

          {/* Mobile actions (visible on small screens) */}
          <div className="lg:hidden px-4 py-3 flex items-center gap-3 bg-gray-900 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setActiveSection("overview")}>Overview</Button>
            <Button variant="ghost" onClick={() => setActiveSection("posts")}>Posts</Button>
            <Button variant="ghost" onClick={() => setActiveSection("realty")}>Realty</Button>
            <div className="ml-auto">
              <Button variant="ghost" onClick={() => { setPostType(""); setIsOpen(true); setActiveSection("create"); }}>
                <Plus className="w-4 h-4 mr-2" /> Create
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="col-span-12 lg:col-span-9 p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-100">Admin <span className="text-yellow-300">Dashboard</span></h1>
              <p className="text-slate-400 mt-1">Manage property listings, gallery posts and admin users</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search posts or location..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border-0 p-0 bg-transparent text-gray-100 placeholder:text-slate-500"
                />
              </div>


            </div>
          </div>

          {/* Overview / Stats */}
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeUp}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard title="Gallery Posts" value={galleryPosts.length} icon={<Image className="w-5 h-5" />} />
                  <StatCard title="Realty Posts" value={realtyPosts.length} icon={<Home className="w-5 h-5" />} />
                  <StatCard title="Admins" value={isSuperAdmin ? "Super" : "Standard"} icon={<UserPlus className="w-5 h-5" />} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create / Edit Post Section (animated container) */}
          <div ref={formRef}>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mb-4"
            >
              <Card className="bg-gray-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-100">{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
                  <p className="text-sm text-slate-400">Select destination and fill the form below.</p>
                </CardHeader>
                <CardContent>
                  <div className="md:flex md:items-start md:gap-6">
                    <div className="md:w-1/3 space-y-3">
                      {!editingPost && (
                        <div>
                          <Label className="text-slate-200">Select Post Destination</Label>
                          <Select value={postType} onValueChange={handlePostTypeChange}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-gray-100">
                              <SelectValue placeholder="Choose where to post..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-slate-800">
                              <SelectItem value="gallery">Gallery Page</SelectItem>
                              <SelectItem value="realty">Realty Page</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="text-sm text-slate-400">
                        Tip: Use clear titles and include location for realty listings.
                      </div>

                      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleContent>
                          {postType === "gallery" && (
                            <GalleryPostForm onSuccess={handleSuccess} editingPost={editingType === "gallery" ? editingPost : null} />
                          )}
                          {postType === "realty" && (
                            <RealtyPostForm onSuccess={handleSuccess} editingPost={editingType === "realty" ? editingPost : null} />
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <div className="md:flex-1 mt-6 md:mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        {/* Quick actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => { setIsOpen((s) => !s); }}>{isOpen ? "Hide Form" : "Show Form"}</Button>
                          <Button variant="ghost" onClick={() => { setPostType(""); setEditingPost(null); setEditingType(null); }}>Reset</Button>
                        </div>

                        {/* If editing, show preview */}
                        {editingPost && (
                          <div className="p-4 border rounded-lg bg-slate-900 border-slate-800">
                            <h3 className="font-semibold text-gray-100">Preview</h3>
                            <p className="text-sm text-slate-400">{editingPost.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Posts list (Gallery) */}
          <AnimatePresence mode="wait">
            {(activeSection === "posts" || activeSection === "overview") && (
              <motion.div
                key="gallery-list"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeUp}
                transition={{ duration: 0.18 }}
              >
                <Card className="bg-gray-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Gallery Posts</CardTitle>
                    <p className="text-sm text-slate-400">Manage gallery posts — edit or remove entries.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredGallery.length === 0 ? (
                        <div className="text-sm text-slate-400">No gallery posts found.</div>
                      ) : (
                        paginate(filteredGallery, galleryPage).map((post) => (
                          <div key={post.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 hover:shadow-lg transition-shadow">
                            <div>
                              <h4 className="font-medium text-gray-100">{post.title}</h4>
                              <div className="text-xs text-slate-400">{post.category} • {new Date(post.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" onClick={() => {
                                setPostType("gallery");
                                setIsOpen(true);
                                setEditingPost(post);
                                setEditingType("gallery");
                                setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                              }}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button variant="destructive" onClick={() => { setPostToDelete({ id: post.id, type: "gallery" }); setDeleteDialogOpen(true); }}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Pagination */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" disabled={galleryPage === 1} onClick={() => setGalleryPage((p) => p - 1)}>Previous</Button>
                          <Button variant="outline" disabled={galleryPage === galleryTotalPages} onClick={() => setGalleryPage((p) => p + 1)}>Next</Button>
                        </div>
                        <div className="text-sm text-slate-400">Page {galleryPage} of {galleryTotalPages}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Realty List */}
          <AnimatePresence mode="wait">
            {(activeSection === "realty" || activeSection === "overview") && (
              <motion.div
                key="realty-list"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeUp}
                transition={{ duration: 0.18 }}
              >
                <Card className="bg-gray-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Realty Posts</CardTitle>
                    <p className="text-sm text-slate-400">Manage property listings.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRealty.length === 0 ? (
                        <div className="text-sm text-slate-400">No realty posts found.</div>
                      ) : (
                        paginate(filteredRealty, realtyPage).map((post) => (
                          <div key={post.id} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 hover:shadow-lg transition-shadow">
                            <div>
                              <h4 className="font-medium text-gray-100">{post.title}</h4>
                              <div className="text-xs text-slate-400">{post.location} • ₦{post.price} • {new Date(post.created_at).toLocaleDateString()}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" onClick={() => {
                                setPostType("realty");
                                setIsOpen(true);
                                setEditingPost(post);
                                setEditingType("realty");
                                setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                              }}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button variant="destructive" onClick={() => { setPostToDelete({ id: post.id, type: "realty" }); setDeleteDialogOpen(true); }}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Pagination */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" disabled={realtyPage === 1} onClick={() => setRealtyPage((p) => p - 1)}>Previous</Button>
                          <Button variant="outline" disabled={realtyPage === realtyTotalPages} onClick={() => setRealtyPage((p) => p + 1)}>Next</Button>
                        </div>
                        <div className="text-sm text-slate-400">Page {realtyPage} of {realtyTotalPages}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="bg-gray-900 border-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-100">Delete post?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Junior Admin Section */}
          {isSuperAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Card className="bg-gray-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100"><UserPlus className="w-5 h-5" /> Create Junior Admin</CardTitle>
                  <p className="text-sm text-slate-400">Junior admins can create and edit posts but cannot delete or create admins.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateJuniorAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-slate-200">Name *</Label>
                        <Input value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} required className="bg-slate-800 text-gray-100" />
                      </div>
                      <div>
                        <Label className="text-slate-200">Email *</Label>
                        <Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required className="bg-slate-800 text-gray-100" />
                      </div>
                      <div>
                        <Label className="text-slate-200">Password *</Label>
                        <Input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required className="bg-slate-800 text-gray-100" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-sky-600 hover:bg-sky-500"><UserPlus className="w-4 h-4 mr-2" /> Create Junior Admin</Button>
                      <Button variant="outline" onClick={() => { setNewAdmin({ name: "", email: "", password: "" }); }}>Reset</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
