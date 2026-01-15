/**
 * Editor Page
 * Create and edit journal entries with auto-save
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Entry } from "../../../shared/models/Entry";
import { MarkdownEditor } from "../components/Editor/MarkdownEditor";
import { FormattingToolbar } from "../components/Editor/FormattingToolbar";
import { useAutoSave } from "../hooks/useAutoSave";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
	ArrowLeft,
	Trash2,
	Save,
	CheckCircle2,
	AlertCircle,
	Loader2,
} from "lucide-react";

export function EditorPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	// Check if id is undefined (route /entry/new) or explicitly "new"
	const isNewEntry = !id || id === "new";

	const debugNavigate = (path, options) => {
		console.log("[DEBUG] useNavigate called:", { path, options });
		return navigate(path, options);
	};

	const [entry, setEntry] = useState(null);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [editor, setEditor] = useState(null);
	const [loading, setLoading] = useState(!isNewEntry);
	const [error, setError] = useState(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleting, setDeleting] = useState(false);

	// Auto-save function
	const saveEntry = useCallback(
		async (currentContent) => {
			console.log("[DEBUG] useCallback: saveEntry called", {
				isNewEntry,
				title,
				contentLength: currentContent?.length,
			});
			try {
				if (isNewEntry) {
					// Create new entry on first save
					const newEntry = new Entry({
						title: title || "Untitled",
						content: currentContent,
						date: new Date().toISOString(),
					});

					const savedEntry = await api.createEntry(newEntry);

					// Update URL to the new entry ID using navigate to update params
					navigate(`/entry/${savedEntry.id}`, { replace: true });
					setEntry(savedEntry);
				} else {
					// Update existing entry
					const updatedEntry = entry.clone();
					updatedEntry.title = title || "Untitled";
					updatedEntry.content = currentContent;
					updatedEntry.touch();
					updatedEntry.generatePreview();

					await api.updateEntry(updatedEntry);
					setEntry(updatedEntry);
				}
			} catch (err) {
				console.error("Error saving entry:", err);
				throw err;
			}
		},
		[isNewEntry, title, entry]
	);

	// Auto-save status
	const autoSaveStatus = useAutoSave(content, saveEntry, 5000);

	// Load entry if editing existing
	useEffect(() => {
		console.log("[DEBUG] useEffect: EditorPage load entry", {
			id,
			isNewEntry,
			hasEntry: !!entry,
			entryId: entry?.id,
		});
		// Only load if:
		// 1. Not a new entry
		// 2. ID is defined
		// 3. We don't already have this entry loaded
		if (!isNewEntry && id && entry?.id !== id) {
			loadEntry();
		}
	}, [id, isNewEntry]);

	async function loadEntry() {
		console.log("[DEBUG] loadEntry called", { id });
		try {
			setLoading(true);
			setError(null);
			const loadedEntry = await api.getEntry(id);
			setEntry(loadedEntry);
			setTitle(loadedEntry.title || "");
			setContent(loadedEntry.content || "");
		} catch (err) {
			console.error("Error loading entry:", err);
			setError("Failed to load entry. It may not exist.");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete() {
		console.log("[DEBUG] handleDelete called", { entryId: entry?.id });
		if (!entry) return;

		setDeleting(true);
		try {
			await api.deleteEntry(entry);
			debugNavigate("/", { replace: true });
		} catch (err) {
			console.error("Error deleting entry:", err);
			setError("Failed to delete entry. Please try again.");
			setDeleting(false);
		}
	}

	function getStatusIndicator() {
		switch (autoSaveStatus) {
			case "saved":
				return (
					<div className="flex items-center gap-2 text-green-600 text-sm">
						<CheckCircle2 size={16} />
						<span>Saved</span>
					</div>
				);
			case "saving":
				return (
					<div className="flex items-center gap-2 text-amber-600 text-sm">
						<Loader2 size={16} className="animate-spin" />
						<span>Saving...</span>
					</div>
				);
			case "pending":
				return (
					<div className="flex items-center gap-2 text-amber-600 text-sm">
						<Save size={16} />
						<span>Unsaved changes</span>
					</div>
				);
			case "error":
				return (
					<div className="flex items-center gap-2 text-rose-600 text-sm">
						<AlertCircle size={16} />
						<span>Error saving</span>
					</div>
				);
			default:
				return null;
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mb-4"></div>
					<p className="text-amber-700 font-medium">
						Loading entry...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
				<div className="max-w-md w-full bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
					<AlertCircle
						className="inline-block text-rose-400 mb-2"
						size={32}
					/>
					<p className="text-rose-700 mb-4">{error}</p>
					<Button
						variant="secondary"
						onClick={() => {
							console.log(
								"[DEBUG] onClick: Back to Home button (error state)"
							);
							debugNavigate("/");
						}}
					>
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Button
							variant="ghost"
							onClick={() => {
								console.log("[DEBUG] onClick: Back button");
								debugNavigate("/");
							}}
							className="flex items-center gap-2"
						>
							<ArrowLeft size={18} />
							Back
						</Button>

						<div className="flex items-center gap-4">
							{getStatusIndicator()}

							{!isNewEntry && (
								<Button
									variant="ghost"
									onClick={() => {
										console.log(
											"[DEBUG] onClick: Delete button"
										);
										setShowDeleteConfirm(true);
									}}
									className="flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
									disabled={deleting}
								>
									<Trash2 size={18} />
									Delete
								</Button>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Editor Content */}
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-4">
					{/* Title Input */}
					<Input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Entry title..."
						className="text-3xl font-serif font-bold border-0 bg-white/80 backdrop-blur-sm shadow-sm"
					/>

					{/* Editor */}
					<div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 shadow-sm overflow-hidden">
						<FormattingToolbar editor={editor} />
						<MarkdownEditor
							initialContent={content}
							onChange={setContent}
							onEditorReady={setEditor}
							placeholder="Start writing your thoughts..."
						/>
					</div>

					{/* Entry metadata */}
					{entry && (
						<div className="text-xs text-amber-600 text-center">
							Created{" "}
							{new Date(entry.createdAt).toLocaleDateString()} •
							Last updated{" "}
							{new Date(entry.updatedAt).toLocaleDateString()}
						</div>
					)}
				</div>
			</main>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
						<h3 className="text-xl font-serif font-semibold text-amber-950 mb-2">
							Delete Entry?
						</h3>
						<p className="text-amber-700 mb-6">
							Are you sure you want to delete "
							{title || "Untitled"}"? This action cannot be
							undone.
						</p>
						<div className="flex gap-3 justify-end">
							<Button
								variant="secondary"
								onClick={() => {
									console.log(
										"[DEBUG] onClick: Cancel delete button"
									);
									setShowDeleteConfirm(false);
								}}
								disabled={deleting}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={() => {
									console.log(
										"[DEBUG] onClick: Confirm delete button"
									);
									handleDelete();
								}}
								disabled={deleting}
								className="bg-rose-500 hover:bg-rose-600"
							>
								{deleting ? "Deleting..." : "Delete"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default EditorPage;
