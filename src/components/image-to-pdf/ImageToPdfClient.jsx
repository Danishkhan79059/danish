"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { jsPDF } from "jspdf";
import {
  UploadCloud,
  FileImage,
  Trash2,
  RotateCw,
  ArrowUp,
  ArrowDown,
  Download,
  Check,
  AlertCircle,
  Sparkles,
  Lock,
  Eye,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  X,
} from "lucide-react";

// Standard Page Dimensions in Millimeters [Width, Height]
const PAGE_FORMATS = {
  a4: { name: "A4", width: 210, height: 297 },
  a3: { name: "A3", width: 297, height: 420 },
  a5: { name: "A5", width: 148, height: 210 },
  letter: { name: "Letter", width: 215.9, height: 279.4 },
  legal: { name: "Legal", width: 215.9, height: 355.6 },
  original: { name: "Original Image Size", width: 0, height: 0 },
};

// Margin presets in mm
const MARGIN_PRESETS = {
  none: { label: "None (0mm)", value: 0 },
  small: { label: "Small (5mm)", value: 5 },
  medium: { label: "Medium (10mm)", value: 10 },
  large: { label: "Large (15mm)", value: 15 },
  custom: { label: "Custom", value: 8 },
};

// Quality presets
const QUALITY_PRESETS = {
  low: { label: "Low (Small File)", val: 0.5 },
  medium: { label: "Medium (Balanced)", val: 0.75 },
  high: { label: "High (Recommended)", val: 0.92 },
  maximum: { label: "Maximum (Lossless)", val: 1.0 },
};

// Helper to format file size
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ImageToPdfClient() {
  // Uploaded files list
  const [imageList, setImageList] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Settings
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait"); // portrait, landscape, auto
  const [imageFit, setImageFit] = useState("fit"); // fit, fill, original
  const [marginType, setMarginType] = useState("medium");
  const [customMargin, setCustomMargin] = useState(10);
  const [imageQuality, setImageQuality] = useState("high");
  const [backgroundColor, setBackgroundColor] = useState("white"); // white, transparent
  const [customFilename, setCustomFilename] = useState("converted-images.pdf");

  // Conversion states
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfSizeBytes, setPdfSizeBytes] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Drag-and-drop reordering state
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState(0);

  const fileInputRef = useRef(null);
  const docRef = useRef(null);
  const downloadSectionRef = useRef(null);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      imageList.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [imageList, pdfBlobUrl]);

  // Handle incoming files
  const processFiles = useCallback(async (files) => {
    setErrorMessage("");
    setSuccessMessage("");
    const newItems = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop().toLowerCase();

      // Check format
      const validExtensions = ["jpg", "jpeg", "png", "svg"];
      if (!validExtensions.includes(ext) && !file.type.startsWith("image/")) {
        setErrorMessage(`"${file.name}" is not a supported image format. Please upload JPG, PNG, or SVG.`);
        continue;
      }

      // Check size (50MB max per file)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 50MB file size limit.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);

      // Read natural dimensions
      let width = 800;
      let height = 600;

      try {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            width = img.naturalWidth || 800;
            height = img.naturalHeight || 600;
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = previewUrl;
        });
      } catch (err) {
        console.warn("Could not read image dimensions:", err);
      }

      newItems.push({
        id: "img_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type || `image/${ext === "svg" ? "svg+xml" : ext}`,
        previewUrl,
        rotation: 0,
        width,
        height,
      });
    }

    if (newItems.length > 0) {
      setImageList((prev) => [...prev, ...newItems]);
      setPdfBlobUrl(null); // Reset generated PDF if new files added
    }
  }, []);

  // Dropzone drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Reordering helpers
  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= imageList.length) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    setPdfBlobUrl(null);
  };

  // Drag to reorder handlers
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverItem = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(draggedItemIndex, 1);
      copy.splice(index, 0, moved);
      return copy;
    });
    setDraggedItemIndex(index);
    setPdfBlobUrl(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  // Rotate image 90° clockwise
  const rotateImage = (index) => {
    setImageList((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.rotation = (item.rotation + 90) % 360;
      copy[index] = item;
      return copy;
    });
    setPdfBlobUrl(null);
  };

  // Remove single image
  const removeImage = (id) => {
    setImageList((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
    setPdfBlobUrl(null);
  };

  // Clear all images
  const clearAllImages = () => {
    imageList.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setImageList([]);
    setPdfBlobUrl(null);
    setPdfSizeBytes(0);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setPageSize("a4");
    setOrientation("portrait");
    setImageFit("fit");
    setMarginType("medium");
    setCustomMargin(10);
    setImageQuality("high");
    setBackgroundColor("white");
    setCustomFilename("converted-images.pdf");
  };

  // Compute Total Files Size
  const totalFileSize = useMemo(() => {
    return imageList.reduce((acc, curr) => acc + curr.size, 0);
  }, [imageList]);

  // Render an individual image (including SVG or rotated raster) onto an offscreen canvas
  const renderImageToCanvas = (item) => {
    return new Promise(async (resolve, reject) => {
      try {
        let sourceDataUrl = "";

        // SVG handling: parse and serialize cleanly with dimensions
        if (item.file.name.toLowerCase().endsWith(".svg") || item.type.includes("svg")) {
          const svgText = await item.file.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(svgText, "image/svg+xml");
          const svgElement = xmlDoc.querySelector("svg");

          if (svgElement) {
            // Ensure width and height exist from viewBox if missing
            if (!svgElement.getAttribute("width") && svgElement.getAttribute("viewBox")) {
              const vb = svgElement.getAttribute("viewBox").split(/[\s,]+/);
              if (vb.length >= 4) {
                svgElement.setAttribute("width", vb[2]);
                svgElement.setAttribute("height", vb[3]);
              }
            }
            if (!svgElement.getAttribute("width")) svgElement.setAttribute("width", "800");
            if (!svgElement.getAttribute("height")) svgElement.setAttribute("height", "600");

            const serialized = new XMLSerializer().serializeToString(svgElement);
            sourceDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serialized);
          } else {
            sourceDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
          }
        } else {
          // Standard Raster (JPG, PNG, WebP) - read directly as Data URL for 100% reliable local canvas drawing
          sourceDataUrl = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = (e) => res(e.target.result);
            reader.onerror = () => rej(new Error(`Failed to read file "${item.name}" from disk.`));
            reader.readAsDataURL(item.file);
          });
        }

        const img = new Image();
        // Do NOT set crossOrigin for local data URLs or files as it causes browser security errors on blob/data URIs
        img.onload = () => {
          try {
            const is90or270 = item.rotation === 90 || item.rotation === 270;
            const origW = img.naturalWidth || img.width || 800;
            const origH = img.naturalHeight || img.height || 600;

            const canvas = document.createElement("canvas");
            const targetW = is90or270 ? origH : origW;
            const targetH = is90or270 ? origW : origH;

            // Limit max dimensions to avoid memory issues with massive images
            const maxDim = 3200;
            let scale = 1;
            if (Math.max(targetW, targetH) > maxDim) {
              scale = maxDim / Math.max(targetW, targetH);
            }

            canvas.width = Math.max(1, Math.round(targetW * scale));
            canvas.height = Math.max(1, Math.round(targetH * scale));

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Browser canvas 2D rendering context is unavailable."));
              return;
            }

            // Background fill for transparent PNGs/SVGs if white background is requested
            if (backgroundColor === "white") {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((item.rotation * Math.PI) / 180);

            const drawW = Math.max(1, Math.round(origW * scale));
            const drawH = Math.max(1, Math.round(origH * scale));
            ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            // Export as JPEG or PNG data URL
            const qVal = QUALITY_PRESETS[imageQuality]?.val || 0.92;
            const desiredMime = backgroundColor === "transparent" ? "image/png" : "image/jpeg";
            const dataUrl = canvas.toDataURL(desiredMime, qVal);
            const actualFormat = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";

            resolve({
              dataUrl,
              format: actualFormat,
              width: canvas.width,
              height: canvas.height,
            });
          } catch (canvasErr) {
            reject(new Error(`Failed to render "${item.name}" on canvas: ${canvasErr.message}`));
          }
        };

        img.onerror = () => {
          reject(new Error(`Failed to decode image data for "${item.name}". The image format may be unsupported or corrupted.`));
        };

        img.src = sourceDataUrl;
      } catch (err) {
        reject(err);
      }
    });
  };

  // Convert Images to PDF
  const handleConvertToPdf = async () => {
    if (imageList.length === 0) {
      setErrorMessage("Please upload at least one image before converting.");
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let doc = null;
      const marginMm = marginType === "custom" ? customMargin : MARGIN_PRESETS[marginType].value;

      for (let i = 0; i < imageList.length; i++) {
        setConversionProgress(Math.round(((i + 0.3) / imageList.length) * 100));
        const item = imageList[i];
        const processed = await renderImageToCanvas(item);

        // Determine effective dimensions
        const imgAspect = processed.width / processed.height;

        // Determine page width and height in mm
        let pageW, pageH;
        if (pageSize === "original") {
          // Convert pixels to mm assuming ~96 DPI (1 px = 0.264583 mm)
          pageW = Math.max(50, Math.min(600, processed.width * 0.264583 + marginMm * 2));
          pageH = Math.max(50, Math.min(600, processed.height * 0.264583 + marginMm * 2));
        } else {
          const standard = PAGE_FORMATS[pageSize];
          let orient = orientation;
          if (orient === "auto") {
            orient = imgAspect > 1 ? "landscape" : "portrait";
          }

          if (orient === "landscape") {
            pageW = Math.max(standard.width, standard.height);
            pageH = Math.min(standard.width, standard.height);
          } else {
            pageW = Math.min(standard.width, standard.height);
            pageH = Math.max(standard.width, standard.height);
          }
        }

        // Initialize jsPDF document on first page, or add new page on subsequent images
        const pageOrientation = pageW > pageH ? "landscape" : "portrait";
        if (i === 0) {
          doc = new jsPDF({
            orientation: pageOrientation,
            unit: "mm",
            format: [pageW, pageH],
            compress: true,
          });
        } else {
          doc.addPage([pageW, pageH], pageOrientation);
        }

        // Calculate printable area
        const printableW = Math.max(10, pageW - marginMm * 2);
        const printableH = Math.max(10, pageH - marginMm * 2);

        let drawW = printableW;
        let drawH = printableH;
        let drawX = marginMm;
        let drawY = marginMm;

        if (imageFit === "fit") {
          // Contain within margins while preserving aspect ratio
          if (printableW / printableH > imgAspect) {
            drawW = printableH * imgAspect;
            drawH = printableH;
            drawX = marginMm + (printableW - drawW) / 2;
          } else {
            drawW = printableW;
            drawH = printableW / imgAspect;
            drawY = marginMm + (printableH - drawH) / 2;
          }
        } else if (imageFit === "fill") {
          // Fill available page area preserving center aspect ratio
          drawW = printableW;
          drawH = printableH;
        } else if (imageFit === "original") {
          // Original scale clamped to printable area
          const originalMmW = processed.width * 0.264583;
          const originalMmH = processed.height * 0.264583;
          drawW = Math.min(printableW, originalMmW);
          drawH = drawW / imgAspect;
          if (drawH > printableH) {
            drawH = printableH;
            drawW = drawH * imgAspect;
          }
          drawX = marginMm + (printableW - drawW) / 2;
          drawY = marginMm + (printableH - drawH) / 2;
        }

        // Add image to the current PDF page
        doc.addImage(processed.dataUrl, processed.format, drawX, drawY, drawW, drawH, undefined, "FAST");
        setConversionProgress(Math.round(((i + 1) / imageList.length) * 100));
      }

      // Store doc in ref for native doc.save() which saves straight to the OS Downloads directory
      docRef.current = doc;

      // Generate blob with explicit application/pdf MIME type
      const pdfArrayBuffer = doc.output("arraybuffer");
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });

      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const newBlobUrl = URL.createObjectURL(pdfBlob);

      setPdfBlobUrl(newBlobUrl);
      setPdfSizeBytes(pdfBlob.size);
      setSuccessMessage(`Successfully converted ${imageList.length} image${imageList.length > 1 ? "s" : ""} to PDF! Saved to your system Downloads.`);

      // Automatically trigger save directly to the system's Downloads folder
      triggerSystemDownload(doc, newBlobUrl);

      // Smooth scroll to the download section
      setTimeout(() => {
        downloadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 150);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setErrorMessage(err?.message || "Failed to generate PDF. Please ensure all uploaded images are valid.");
    } finally {
      setIsConverting(false);
    }
  };

  // Triggers genuine system download to the device's Downloads directory
  const triggerSystemDownload = (docInstance, blobUrl) => {
    let safeName = customFilename.trim();
    if (!safeName) safeName = "converted-images.pdf";
    if (!safeName.toLowerCase().endsWith(".pdf")) safeName += ".pdf";

    // 1. Primary: jsPDF native save() uses FileSaver, writing directly to the OS Downloads directory
    if (docInstance && typeof docInstance.save === "function") {
      try {
        docInstance.save(safeName);
        return;
      } catch (err) {
        console.warn("jsPDF doc.save() failed, falling back to anchor download:", err);
      }
    }

    // 2. Fallback: Anchor tag download with explicit download attribute and target
    const urlToUse = blobUrl || pdfBlobUrl;
    if (urlToUse) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = urlToUse;
      a.setAttribute("download", safeName);
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      }, 300);
    }
  };

  // Download the generated PDF button handler
  const handleDownloadPdf = () => {
    triggerSystemDownload(docRef.current, pdfBlobUrl);
  };

  const faqs = [
    {
      q: "How do I convert JPG to PDF?",
      a: "Drag and drop your JPG files into the upload box or click to select them from your device. You can customize page size (such as A4 or Letter), margins, and orientation. Then click 'Convert to PDF' and download your compiled PDF instantly.",
    },
    {
      q: "Can I convert PNG to PDF?",
      a: "Yes! Transparent and opaque PNG images are fully supported. You can choose whether transparent PNGs should have a clean white background or maintain transparency in the PDF.",
    },
    {
      q: "Can I convert SVG to PDF?",
      a: "Yes! SVG vector graphics are automatically rasterized at high resolution before being embedded, preserving sharp outlines, icons, and diagrams in the final document.",
    },
    {
      q: "Can I combine multiple images into one PDF?",
      a: "Absolutely. You can upload multiple JPG, PNG, and SVG files at the same time. Each image will be converted into a separate PDF page in the exact order you select.",
    },
    {
      q: "Are my files uploaded to a server?",
      a: "No! Your privacy is 100% guaranteed. All processing, resizing, rotating, and PDF compiling occurs entirely in your browser using client-side JavaScript. No images or files are ever sent to any server or third-party service.",
    },
    {
      q: "Can I reorder images before creating the PDF?",
      a: "Yes. In the file list, you can use the Move Up / Move Down buttons or simply drag and drop the image cards into your preferred sequence before converting.",
    },
    {
      q: "Can I convert images to PDF on mobile?",
      a: "Yes! This tool is fully responsive and touch-friendly on iOS Safari, Android Chrome, tablets, and desktop browsers without installing any mobile application.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ================= 1. HERO SECTION ================= */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-[var(--primary)] border border-purple-200/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fast Client-Side Converter</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>🔒 100% Private &amp; Offline</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
          JPG PNG SVG to PDF Converter
        </h1>

        <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
          Convert JPG, JPEG, PNG and SVG images into high-quality PDF documents directly in your browser. Combine multiple images into a multi-page PDF, reorder pages, customize margins, and download instantly without uploading your files.
        </p>

        {/* Privacy Callout */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Your files are processed locally in your browser.</strong> Files are never uploaded to our servers.
          </span>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-rose-900">Upload / Conversion Notice</h3>
            <p className="text-xs text-rose-800 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-emerald-900">Conversion Successful</h3>
            <p className="text-xs text-emerald-800 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* ================= 2. TWO-COLUMN INTERFACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* ================= LEFT COLUMN: UPLOAD & FILE LIST (7 Cols) ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* DRAG & DROP UPLOAD ZONE */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
              dragActive
                ? "border-[var(--primary)] bg-purple-50/80 scale-[1.01] shadow-lg ring-4 ring-purple-100"
                : "border-slate-300 bg-white hover:border-[var(--primary)] hover:bg-slate-50/60 shadow-sm"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-[var(--primary)] mb-4 transition-transform group-hover:scale-105">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              Drag &amp; drop your images here, or{" "}
              <span className="text-[var(--primary)] underline underline-offset-2">browse files</span>
            </h2>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Supports <strong className="text-slate-700">JPG, JPEG, PNG, SVG</strong>. Maximum 50MB per file. Multiple files allowed.
            </p>
          </div>

          {/* UPLOADED FILE LIST */}
          {imageList.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Selected Images ({imageList.length})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-[var(--primary)] hover:border-purple-200 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5 text-slate-500" />
                    <span>Add More</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-500">
                Each image represents one page in the generated PDF. Drag or use arrows to reorder, or rotate 90° if needed.
              </p>

              {/* Reorderable Items */}
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {imageList.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOverItem(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      draggedItemIndex === index
                        ? "border-[var(--primary)] bg-purple-50/50 opacity-60"
                        : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs"
                    }`}
                  >
                    {/* Page Number Badge */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xs font-bold text-[var(--primary)]">
                      {index + 1}
                    </div>

                    {/* Thumbnail with rotation */}
                    <div className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain transition-transform"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="uppercase font-semibold text-[var(--primary)]">
                          {item.name.split(".").pop()}
                        </span>
                        <span>•</span>
                        <span>{formatBytes(item.size)}</span>
                        <span>•</span>
                        <span>
                          {item.rotation === 90 || item.rotation === 270
                            ? `${item.height}×${item.width}`
                            : `${item.width}×${item.height}`}
                        </span>
                        {item.rotation > 0 && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md font-bold">
                            {item.rotation}°
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: Rotate, Move Up, Move Down, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => rotateImage(index)}
                        title="Rotate 90° Clockwise"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[var(--primary)] hover:border-purple-300 transition-colors cursor-pointer"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveImage(index, -1)}
                        title="Move Up (Earlier Page)"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[var(--primary)] hover:border-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === imageList.length - 1}
                        onClick={() => moveImage(index, 1)}
                        title="Move Down (Later Page)"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[var(--primary)] hover:border-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        title="Remove Image"
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer ml-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: SETTINGS & CONVERSION (5 Cols) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl flex flex-col gap-5">
            {/* Header & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-canva-gradient flex items-center justify-center text-white shadow-xs">
                  <Sliders className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  PDF Settings
                </h3>
              </div>

              <button
                type="button"
                onClick={resetSettings}
                className="text-xs font-semibold text-slate-500 hover:text-[var(--primary)] transition-colors cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Images
                </span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {imageList.length}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Pages
                </span>
                <span className="text-sm font-extrabold text-[var(--primary)] mt-0.5 block">
                  {imageList.length}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Input Size
                </span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {formatBytes(totalFileSize)}
                </span>
              </div>
            </div>

            {/* SETTINGS CONTROLS */}
            <div className="space-y-4">
              {/* Page Size & Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="page-size" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Page Size
                  </label>
                  <select
                    id="page-size"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="a3">A3 (297 × 420 mm)</option>
                    <option value="a5">A5 (148 × 210 mm)</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="legal">Legal (8.5 × 14 in)</option>
                    <option value="original">Original Image Size</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="orientation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Orientation
                  </label>
                  <select
                    id="orientation"
                    value={orientation}
                    disabled={pageSize === "original"}
                    onChange={(e) => {
                      setOrientation(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer disabled:opacity-50"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="auto">Auto (Smart Match)</option>
                  </select>
                </div>
              </div>

              {/* Image Fit & Margins */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="image-fit" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Image Fit
                  </label>
                  <select
                    id="image-fit"
                    value={imageFit}
                    onChange={(e) => {
                      setImageFit(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    <option value="fit">Fit to Page (Maintain Aspect)</option>
                    <option value="fill">Fill Page</option>
                    <option value="original">Original Size</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="margin-type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Margins
                  </label>
                  <select
                    id="margin-type"
                    value={marginType}
                    onChange={(e) => {
                      setMarginType(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    {Object.entries(MARGIN_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {marginType === "custom" && (
                <div>
                  <label htmlFor="custom-margin" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Margin (mm)
                  </label>
                  <input
                    id="custom-margin"
                    type="number"
                    min={0}
                    max={50}
                    value={customMargin}
                    onChange={(e) => {
                      setCustomMargin(Math.max(0, Number(e.target.value)));
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                  />
                </div>
              )}

              {/* Image Quality & Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="image-quality" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Image Quality
                  </label>
                  <select
                    id="image-quality"
                    value={imageQuality}
                    onChange={(e) => {
                      setImageQuality(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    {Object.entries(QUALITY_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="background-color" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Background
                  </label>
                  <select
                    id="background-color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      setPdfBlobUrl(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-semibold text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    <option value="white">White (Standard)</option>
                    <option value="transparent">Transparent (PNG/SVG)</option>
                  </select>
                </div>
              </div>

              {/* Custom Filename */}
              <div>
                <label htmlFor="custom-filename" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Output Filename
                </label>
                <div className="relative">
                  <input
                    id="custom-filename"
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    placeholder="converted-images.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-mono text-slate-800 focus:border-[var(--primary)] focus:bg-white focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            {/* PROGRESS BAR IF CONVERTING */}
            {isConverting && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Converting images to PDF...</span>
                  <span>{conversionProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-canva-gradient transition-all duration-200 rounded-full"
                    style={{ width: `${conversionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* ACTION BUTTONS: Convert & Download */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConvertToPdf}
                disabled={imageList.length === 0 || isConverting}
                className="btn-canva-primary w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold shadow-md disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all active:scale-98"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Processing ({conversionProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Convert to PDF</span>
                  </>
                )}
              </button>

              {pdfBlobUrl && (
                <div ref={downloadSectionRef} className="flex flex-col gap-2 pt-1 animate-in fade-in-50 duration-200">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF ({formatBytes(pdfSizeBytes)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:border-purple-300 hover:text-[var(--primary)] transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500" />
                    <span>Preview PDF ({imageList.length} pages)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {previewModalOpen && pdfBlobUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in-0 duration-150">
          <div className="relative flex flex-col w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--primary)]" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  PDF Preview: {customFilename}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="btn-canva-primary flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={pdfBlobUrl}
                title="PDF Preview"
                className="w-full h-full rounded-2xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SEO EDUCATIONAL CONTENT ================= */}
      <div className="border-t border-slate-200 pt-16 mb-16">
        <div className="max-w-4xl mx-auto space-y-12 text-slate-700 leading-relaxed">
          {/* Section: Overview */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              JPG PNG SVG to PDF Converter
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-3">
              Easily convert photos, scans, graphics, and vector designs into clean, professional PDF documents. Whether you have single receipts or dozens of high-resolution images, this tool combines them into an organized, downloadable PDF without requiring any software installation or user registration.
            </p>
            <p className="text-sm sm:text-base text-slate-600">
              Unlike cloud-based PDF tools that upload your private documents and photos to external servers, this converter runs <strong>100% locally in your web browser</strong>. All rendering, compression, and compilation occurs on your device, ensuring maximum speed and complete data privacy.
            </p>
          </div>

          {/* Section: How to Convert Images to PDF */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              How to Convert Images to PDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Upload Images
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drag and drop JPG, JPEG, PNG, or SVG files into the upload area or click to browse from your device.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Reorder &amp; Rotate
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Arrange your pages in the exact sequence you want using the arrow controls or drag handles. Rotate pages 90° if needed.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Select Page Size
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose standard formats like A4, A3, Letter, Legal, or match original image dimensions. Set portrait or landscape.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  4
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Adjust Margins &amp; Fit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your desired margin spacing (None, Small, Medium, Large) and image fit mode to avoid cropping or stretching.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  5
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Click Convert to PDF
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click &quot;Convert to PDF&quot; to compile your pages with high-performance client-side rendering.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-purple-100 text-[var(--primary)] font-extrabold flex items-center justify-center text-sm mb-3">
                  6
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  Download the PDF
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Preview your converted document and download the ready-to-share PDF file with a custom filename.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Are my files uploaded to a server?
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              No. <strong>Your files are never uploaded to any remote server, database, or third-party cloud.</strong> The entire conversion and rendering process takes place on your device inside your browser using HTML5 Canvas and Web APIs. Your confidential documents, receipts, signatures, and personal photos remain completely secure.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. INTERACTIVE FAQ ACCORDION ================= */}
      <div className="border-t border-slate-200 pt-16 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything you need to know about converting images to PDF online.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 hover:text-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                    <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
