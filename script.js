/* ════════════════════════════════════════════════════════════════════
   MODAL + TOAST
   ════════════════════════════════════════════════════════════════════ */
const Modal = {
  overlay: document.getElementById("modal-overlay"),
  confirmCb: null,
  show({
    title,
    body,
    type = "info",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    hideCancel = false,
  }) {
    const icons = {
      info: "ph-info",
      danger: "ph-warning",
      success: "ph-check-circle",
      warning: "ph-warning",
    };
    const iconEl = document.getElementById("modal-icon");
    iconEl.classList.remove("danger", "info", "success", "warning");
    iconEl.classList.add(type);
    iconEl.innerHTML = `<i class="ph-fill ${icons[type] || "ph-info"}"></i>`;
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").textContent = body || "";
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;
    cancelBtn.classList.toggle("hidden", hideCancel);
    confirmBtn.classList.toggle("danger", type === "danger");
    this.confirmCb = onConfirm;
    this.overlay.classList.add("open");
  },
  hide() {
    this.overlay.classList.remove("open");
    document.getElementById("modal-confirm").classList.remove("danger");
    this.confirmCb = null;
  },
};
document.getElementById("modal-confirm").addEventListener("click", () => {
  const cb = Modal.confirmCb;
  Modal.hide();
  if (cb) cb();
});
document
  .getElementById("modal-cancel")
  .addEventListener("click", () => Modal.hide());
Modal.overlay.addEventListener("click", (e) => {
  if (e.target === Modal.overlay) Modal.hide();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && Modal.overlay.classList.contains("open"))
    Modal.hide();
});

const Toast = {
  container: document.getElementById("toast-container"),
  show(message, type = "info") {
    const icons = {
      success: "ph-check-circle",
      error: "ph-x-circle",
      info: "ph-info",
    };
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="ph-fill ${icons[type] || "ph-info"}"></i><span></span>`;
    // Safe text insertion (no HTML injection)
    el.querySelector("span").textContent = message;
    this.container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },
};

/* ════════════════════════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════════════════════════ */
const DEFAULT_GRADIENT = {
  enabled: false,
  type: "linear",
  rotation: 0,
  colorStops: [
    { offset: 0, color: "#4f46e5" },
    { offset: 1, color: "#ec4899" },
  ],
};

const RANDOM_DESIGN_PALETTES = [
  { dots: "#111827", background: "#f8fafc", accent: "#4f46e5" },
  { dots: "#102a43", background: "#f0f9ff", accent: "#0369a1" },
  { dots: "#163020", background: "#f0fdf4", accent: "#16a34a" },
  { dots: "#3b1d2a", background: "#fff1f2", accent: "#e11d48" },
  { dots: "#2f2557", background: "#f5f3ff", accent: "#7c3aed" },
  { dots: "#422006", background: "#fffbeb", accent: "#d97706" },
];

const State = {
  contentType: "url",
  solidColors: {
    dots: "#0f172a",
    bg: "#ffffff",
    cornerSq: "#0f172a",
    cornerDot: "#0f172a",
  },
  qrOptions: {
    width: 1024,
    height: 1024,
    type: "canvas",
    shape: "square",
    data: "https://qrcraft.dev",
    margin: 90,
    qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "M" },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: "anonymous",
      saveAsBlob: false,
    },
    dotsOptions: { type: "square", color: "#0f172a", roundSize: true },
    backgroundOptions: { color: "#ffffff" },
    image: "",
    cornersSquareOptions: { type: "square", color: "#0f172a" },
    cornersDotOptions: { type: "square", color: "#0f172a" },
  },
  gradients: {
    dots: JSON.parse(JSON.stringify(DEFAULT_GRADIENT)),
    bg: JSON.parse(
      JSON.stringify({
        ...DEFAULT_GRADIENT,
        colorStops: [
          { offset: 0, color: "#f8fafc" },
          { offset: 1, color: "#e0e7ff" },
        ],
      }),
    ),
    corner: JSON.parse(
      JSON.stringify({
        ...DEFAULT_GRADIENT,
        colorStops: [
          { offset: 0, color: "#0f172a" },
          { offset: 1, color: "#4f46e5" },
        ],
      }),
    ),
  },
  transparentBg: false,
  border: {
    enabled: false,
    thickness: 36,
    color: "#0f172a",
    round: 0.2,
    dasharray: "",
    inner: { enabled: false, thickness: 8, color: "#4f46e5" },
    outer: { enabled: false, thickness: 8, color: "#0f172a" },
    decorations: { top: "", right: "", bottom: "", left: "" },
    textColor: "#0f172a",
    textSize: 24,
  },
};

const qrEngine = new QRCodeStyling(State.qrOptions);
qrEngine.applyExtension((svg, options) => {
  if (!State.border.enabled) return;
  if (typeof QRBorderPlugin !== "function") {
    throw new Error("QR Border Plugin failed to load.");
  }
  const decorations = {};
  for (const position of ["top", "right", "bottom", "left"]) {
    const value = State.border.decorations[position].trim();
    if (value) {
      decorations[position] = {
        type: "text",
        value,
        style: `font: ${State.border.textSize}px sans-serif; fill: ${State.border.textColor};`,
      };
    }
  }
  QRBorderPlugin({
    round: State.border.round,
    thickness: State.border.thickness,
    color: State.border.color,
    dasharray: State.border.dasharray,
    decorations,
    borderInner: State.border.inner.enabled
      ? {
          thickness: State.border.inner.thickness,
          color: State.border.inner.color,
          dasharray: "",
        }
      : undefined,
    borderOuter: State.border.outer.enabled
      ? {
          thickness: State.border.outer.thickness,
          color: State.border.outer.color,
          dasharray: "",
        }
      : undefined,
  })(svg, options);
});
const DOM = { canvas: document.getElementById("live-preview-canvas") };

/* ════════════════════════════════════════════════════════════════════
   UTILS
   ════════════════════════════════════════════════════════════════════ */
const U = {
  debounce: (fn, wait) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  },
  buildEmail: (em, sub, body) =>
    em
      ? `mailto:${em}?subject=${encodeURIComponent(sub || "")}&body=${encodeURIComponent(body || "")}`
      : "https://qrcraft.dev",
  buildSms: (ph, msg) =>
    ph ? `SMSTO:${ph}:${msg || ""}` : "https://qrcraft.dev",
  buildWiFi: (s, p, e) =>
    s ? `WIFI:T:${e};S:${s};P:${p};;` : "https://qrcraft.dev",
  buildVCard: (n, ph, em, c) =>
    n
      ? `BEGIN:VCARD\nVERSION:3.0\nN:${n};${n}\nFN:${n}\nORG:${c}\nTEL;TYPE=cell:${ph}\nEMAIL:${em}\nEND:VCARD`
      : "https://qrcraft.dev",
  buildGeo: (lat, lng) => `geo:${lat},${lng}`,
  buildEvent: (t, l, s, e) =>
    `BEGIN:VEVENT\nSUMMARY:${t}\nLOCATION:${l}\nDTSTART:${s}\nDTEND:${e}\nEND:VEVENT`,
  buildWhatsApp: (ph, msg) =>
    ph
      ? `https://wa.me/${ph.replace(/[^\d]/g, "")}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`
      : "https://qrcraft.dev",
  buildTelegram: (u) =>
    u ? `https://t.me/${u.replace(/^@/, "")}` : "https://qrcraft.dev",
  buildBitcoin: (addr, amt, label) => {
    if (!addr) return "https://qrcraft.dev";
    let s = `bitcoin:${addr}`;
    const params = [];
    if (amt) params.push(`amount=${amt}`);
    if (label) params.push(`label=${encodeURIComponent(label)}`);
    return params.length ? `${s}?${params.join("&")}` : s;
  },
  buildOtp: (secret, issuer, account) => {
    if (!secret) return "https://qrcraft.dev";
    const label =
      issuer && account
        ? `${encodeURIComponent(issuer)}:${encodeURIComponent(account)}`
        : encodeURIComponent(account || issuer || "Account");
    return `otpauth://totp/${label}?secret=${secret}${issuer ? `&issuer=${encodeURIComponent(issuer)}` : ""}`;
  },
  // Bug fix #10: FaceTime URI. Apple documents `facetime:` (no slashes) for both addresses and numbers.
  buildFaceTime: (a) => (a ? `facetime:${a}` : "https://qrcraft.dev"),
  buildMecard: (n, ph, em, org) => {
    if (!n) return "https://qrcraft.dev";
    return `MECARD:N:${n};TEL:${ph};EMAIL:${em};ORG:${org};;`;
  },
  toLibGradient: (g) => ({
    type: g.type,
    rotation: g.rotation,
    colorStops: g.colorStops.map((s) => ({
      offset: s.offset,
      color: s.color,
    })),
  }),
};

/* ════════════════════════════════════════════════════════════════════
   COLOR APPLICATION
   ════════════════════════════════════════════════════════════════════ */
function applyColorsToQR() {
  const d = State.qrOptions.dotsOptions;
  const b = State.qrOptions.backgroundOptions;
  const cs = State.qrOptions.cornersSquareOptions;
  const cd = State.qrOptions.cornersDotOptions;

  // Explicit nulls clear stale nested gradient options in the library's shallow update.
  d.gradient = null;
  b.gradient = null;
  cs.gradient = null;
  cd.gradient = null;

  if (State.gradients.dots.enabled) {
    d.gradient = U.toLibGradient(State.gradients.dots);
    delete d.color;
  } else {
    d.color = State.solidColors.dots;
  }

  if (State.transparentBg) {
    b.color = "transparent";
  } else if (State.gradients.bg.enabled) {
    b.gradient = U.toLibGradient(State.gradients.bg);
    delete b.color;
  } else {
    b.color = State.solidColors.bg;
  }

  if (State.gradients.corner.enabled) {
    const g = U.toLibGradient(State.gradients.corner);
    cs.gradient = { ...g };
    cd.gradient = { ...g };
    delete cs.color;
    delete cd.color;
  } else {
    cs.color = State.solidColors.cornerSq;
    cd.color = State.solidColors.cornerDot;
  }
  // NOTE: no DOM sync here — bug fix #2. UI is synced explicitly after state transitions.
}

/** Explicitly sync the solid color inputs from State. Call only after intentional state transitions. */
function syncSolidInputsFromState() {
  const map = {
    "color-fg": "dots",
    "color-bg": "bg",
    "color-corner-sq": "cornerSq",
    "color-corner-dt": "cornerDot",
  };
  for (const [id, key] of Object.entries(map)) {
    const inp = document.getElementById(id);
    if (inp) inp.value = State.solidColors[key];
    const txt = document.getElementById(id + "-text");
    if (txt) txt.value = State.solidColors[key];
  }
}

/* ════════════════════════════════════════════════════════════════════
   RENDERER
   ════════════════════════════════════════════════════════════════════ */
const Renderer = {
  async updateCanvas(forDownload = false, overrideSize = null) {
    try {
      applyColorsToQR();
      const baseSize =
        overrideSize ||
        (forDownload
          ? parseInt(document.getElementById("export-size").value)
          : State.qrOptions.width);
      State.qrOptions.width = baseSize;
      State.qrOptions.height = baseSize;
      qrEngine.update({
        ...State.qrOptions,
        imageOptions: {
          ...State.qrOptions.imageOptions,
          saveAsBlob: true,
        },
      });

      // Bug fix #5: wrap getRawData in try so logo decode errors surface as a toast, not a silent blank canvas
      let blob;
      try {
        blob = await qrEngine.getRawData("png");
      } catch (err) {
        console.error("QR generation failed:", err);
        Toast.show(
          "QR rendering failed — try removing the logo or reducing its size.",
          "error",
        );
        return null;
      }
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
      URL.revokeObjectURL(url);

      const target = forDownload
        ? document.createElement("canvas")
        : DOM.canvas;
      target.width = baseSize;
      target.height = baseSize;
      const ctx = target.getContext("2d");
      ctx.clearRect(0, 0, baseSize, baseSize);
      ctx.drawImage(img, 0, 0, baseSize, baseSize);
      return target;
    } catch (e) {
      console.error("Render error:", e);
      return null;
    }
  },
  async triggerDownload() {
    const fmt = document.getElementById("export-format").value;
    const size = parseInt(document.getElementById("export-size").value);
    if (fmt === "svg") {
      applyColorsToQR();
      State.qrOptions.width = size;
      State.qrOptions.height = size;
      const prevType = State.qrOptions.type;
      State.qrOptions.type = "svg";
      qrEngine.update(State.qrOptions);
      await qrEngine.download({
        extension: "svg",
        name: "qrcraft-design",
      });
      State.qrOptions.type = prevType;
      qrEngine.update(State.qrOptions);
      return;
    }
    const ext = fmt === "jpeg" ? "jpeg" : fmt === "webp" ? "webp" : "png";
    const canvas = await Renderer.updateCanvas(true, size);
    if (!canvas) throw new Error("render-failed");
    const link = document.createElement("a");
    link.download = `qrcraft-design.${ext}`;
    link.href = canvas.toDataURL(`image/${ext}`, 1.0);
    link.click();
  },
  async copyToClipboard() {
    if (
      !window.isSecureContext ||
      !navigator.clipboard?.write ||
      !window.ClipboardItem
    ) {
      throw new Error(
        "Clipboard image access is unavailable. Open QRCraft in a secure browser context and allow clipboard access.",
      );
    }
    const canvas = await Renderer.updateCanvas();
    if (!canvas) throw new Error("Could not render the QR image.");
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Could not encode the QR image."));
      }, "image/png");
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  },
};

const updateLivePreview = U.debounce(() => Renderer.updateCanvas(), 120);

/* ════════════════════════════════════════════════════════════════════
   GRADIENT UI
   ════════════════════════════════════════════════════════════════════ */
function renderGradientStops(prefix) {
  const container = document.getElementById(`grad-${prefix}-stops`);
  const grad = State.gradients[prefix];
  container.innerHTML = "";
  grad.colorStops.forEach((stop, idx) => {
    const row = document.createElement("div");
    row.className = "gradient-stop";
    row.innerHTML = `
            <input type="color" class="stop-color" value="${stop.color}">
            <input type="range" class="stop-offset h-[6px] w-full appearance-none rounded-[3px] border-0 bg-slate-200 p-0 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(79,70,229,0.15)] [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb:hover]:shadow-[0_0_0_5px_rgba(79,70,229,0.2)]" min="0" max="1" step="0.01" value="${stop.offset}">
            <span class="stop-label">${Math.round(stop.offset * 100)}%</span>
            ${grad.colorStops.length > 2 ? '<button class="btn-mini btn-mini-icon stop-remove" title="Remove"><i class="ph ph-x"></i></button>' : ""}
        `;
    row.querySelector(".stop-color").addEventListener("input", (e) => {
      State.gradients[prefix].colorStops[idx].color = e.target.value;
      updateGradientPreview(prefix);
      updateLivePreview();
    });
    row.querySelector(".stop-offset").addEventListener("input", (e) => {
      State.gradients[prefix].colorStops[idx].offset = parseFloat(
        e.target.value,
      );
      row.querySelector(".stop-label").textContent =
        Math.round(e.target.value * 100) + "%";
      updateGradientPreview(prefix);
      updateLivePreview();
    });
    const rm = row.querySelector(".stop-remove");
    if (rm)
      rm.addEventListener("click", () => {
        State.gradients[prefix].colorStops.splice(idx, 1);
        renderGradientStops(prefix);
        updateGradientPreview(prefix);
        updateLivePreview();
      });
    container.appendChild(row);
  });
}

function updateGradientPreview(prefix) {
  const g = State.gradients[prefix];
  const el = document.getElementById(`grad-${prefix}-preview`);
  if (!g.enabled) {
    el.classList.forEach((name) => {
      if (name.startsWith("bg-[")) el.classList.remove(name);
    });
    el.classList.add(
      "bg-[repeating-linear-gradient(45deg,#e2e8f0,#e2e8f0_4px,#fff_4px,#fff_8px)]",
    );
    return;
  }
  const deg = ((g.rotation * 180) / Math.PI).toFixed(0);
  const stops = [...g.colorStops]
    .sort((a, b) => a.offset - b.offset)
    .map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
    .join(", ");
  const background =
    g.type === "radial"
      ? `radial-gradient(circle, ${stops})`
      : `linear-gradient(${deg}deg, ${stops})`;
  el.classList.forEach((name) => {
    if (name.startsWith("bg-[")) el.classList.remove(name);
  });
  el.classList.add(`bg-[${background.replaceAll(" ", "_")}]`);
}

function setColorSubview(subtab) {
  document
    .querySelectorAll("#color-subtabs .sub-tab")
    .forEach((tab) =>
      tab.classList.toggle("active", tab.dataset.subtab === subtab),
    );
  document.querySelectorAll(".color-subview").forEach((view) => {
    view.classList.toggle("hidden", view.id !== `color-${subtab}`);
  });
}

function bindGradientSection(prefix) {
  const enable = document.getElementById(`grad-${prefix}-enabled`);
  const type = document.getElementById(`grad-${prefix}-type`);
  const rotation = document.getElementById(`grad-${prefix}-rotation`);
  const rotLabel = document.getElementById(`grad-${prefix}-rot-label`);
  const addBtn = document.getElementById(`grad-${prefix}-add`);

  enable.addEventListener("change", (e) => {
    State.gradients[prefix].enabled = e.target.checked;
    if (!e.target.checked) {
      syncSolidInputsFromState();
      setColorSubview("solid");
      Toast.show(
        `${prefix === "bg" ? "Background" : prefix === "corner" ? "Corner" : "Dots"} gradient disabled — using solid colors`,
        "info",
      );
    }
    updateGradientPreview(prefix);
    updateLivePreview();
  });
  type.addEventListener("change", (e) => {
    State.gradients[prefix].type = e.target.value;
    updateGradientPreview(prefix);
    updateLivePreview();
  });
  rotation.addEventListener("input", (e) => {
    State.gradients[prefix].rotation = parseFloat(e.target.value);
    rotLabel.textContent = Math.round((e.target.value * 180) / Math.PI) + "°";
    updateGradientPreview(prefix);
    updateLivePreview();
  });
  addBtn.addEventListener("click", () => {
    if (State.gradients[prefix].colorStops.length >= 5) {
      Toast.show("Maximum 5 stops per gradient", "error");
      return;
    }
    State.gradients[prefix].colorStops.push({
      offset: 0.5,
      color: "#ffffff",
    });
    renderGradientStops(prefix);
    updateGradientPreview(prefix);
    updateLivePreview();
  });

  enable.checked = State.gradients[prefix].enabled;
  type.value = State.gradients[prefix].type;
  rotation.value = State.gradients[prefix].rotation;
  rotLabel.textContent =
    Math.round((State.gradients[prefix].rotation * 180) / Math.PI) + "°";
  renderGradientStops(prefix);
  updateGradientPreview(prefix);
}

/* ════════════════════════════════════════════════════════════════════
   TEMPLATES
   ════════════════════════════════════════════════════════════════════ */
const PRELOADED_LOGOS = [
  // Social media & communities
  {
    name: "GitHub",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/github.png",
  },
  {
    name: "YouTube",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/youtube.png",
  },
  {
    name: "Instagram",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/instagram.png",
  },
  {
    name: "Facebook",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/facebook.png",
  },
  {
    name: "X",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/x.png",
  },
  {
    name: "TikTok",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/tiktok.png",
  },
  {
    name: "LinkedIn",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/linkedin.png",
  },
  {
    name: "Reddit",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/reddit.png",
  },
  {
    name: "Pinterest",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/pinterest.png",
  },
  {
    name: "Snapchat",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/snapchat.png",
  },
  {
    name: "Threads",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/threads.png",
  },
  {
    name: "Bluesky",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/bluesky.png",
  },
  {
    name: "Mastodon",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/mastodon.png",
  },
  {
    name: "Tumblr",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/tumblr.png",
  },
  {
    name: "Twitch",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/twitch.png",
  },
  {
    name: "Discord",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/discord.png",
  },
  {
    name: "Telegram",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/telegram.png",
  },

  // Messaging & communication
  {
    name: "WhatsApp",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/whatsapp.png",
  },

  {
    name: "Messenger",
    url: "https://cdn-icons-png.flaticon.com/512/3814/3814521.png",
  },
  {
    name: "Signal",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/signal.png",
  },
  {
    name: "Skype",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/skype.png",
  },
  {
    name: "Zoom",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/zoom.png",
  },

  {
    name: "Slack",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/slack.png",
  },

  // Email & Google services
  {
    name: "Gmail",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/gmail.png",
  },
  {
    name: "Google",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google.png",
  },
  {
    name: "Google Drive",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-drive.png",
  },
  {
    name: "Google Photos",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-photos.png",
  },
  {
    name: "Google Calendar",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-calendar.png",
  },
  {
    name: "Google Maps",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/google-maps.png",
  },

  // Music & entertainment
  {
    name: "Spotify",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/spotify.png",
  },
  {
    name: "Apple Music",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/apple-music.png",
  },
  {
    name: "SoundCloud",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/soundcloud.png",
  },
  {
    name: "Netflix",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/netflix.png",
  },
  {
    name: "Prime Video",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/prime-video.png",
  },
  {
    name: "Steam",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/steam.png",
  },

  // Developer & design platforms
  {
    name: "GitLab",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/gitlab.png",
  },

  {
    name: "Figma",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/figma.png",
  },

  {
    name: "Behance",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/behance.png",
  },

  {
    name: "Notion",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/notion.png",
  },

  // Cloud storage & productivity
  {
    name: "Dropbox",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/dropbox.png",
  },

  {
    name: "Apple",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/apple.png",
  },
  {
    name: "Chrome",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/chrome.png",
  },

  // Payments & business
  {
    name: "PayPal",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/paypal.png",
  },
  {
    name: "Stripe",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/stripe.png",
  },
  {
    name: "Patreon",
    url: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/patreon.png",
  },

  // Generic QR destinations & contact icons
  {
    name: "Phone",
    url: "https://cdn-icons-png.flaticon.com/512/5585/5585856.png",
  },
  {
    name: "Maps",
    url: "https://cdn-icons-png.flaticon.com/512/2642/2642502.png",
  },
  {
    name: "Website",
    url: "https://cdn-icons-png.flaticon.com/512/8034/8034787.png",
  },
  {
    name: "mail",
    url: "https://cdn-icons-png.flaticon.com/512/6244/6244710.png",
  },
  {
    name: "heart",
    url: "https://cdn-icons-png.flaticon.com/512/3670/3670159.png",
  },
];

const TemplatesData = [
  {
    name: "Classic",
    opts: {
      dotsOptions: { type: "square", color: "#000" },
      backgroundOptions: { color: "#fff" },
      cornersSquareOptions: { type: "square", color: "#000" },
      cornersDotOptions: { type: "square", color: "#000" },
    },
  },
  {
    name: "Modern Blue",
    opts: {
      dotsOptions: { type: "rounded", color: "#2563eb" },
      backgroundOptions: { color: "#fff" },
      cornersSquareOptions: { type: "extra-rounded", color: "#1e40af" },
      cornersDotOptions: { type: "dot", color: "#1e40af" },
    },
  },
  {
    name: "Sunset",
    opts: {
      dotsOptions: { type: "classy", color: "#ea580c" },
      backgroundOptions: { color: "#fff7ed" },
      cornersSquareOptions: { type: "extra-rounded", color: "#c2410c" },
      cornersDotOptions: { type: "square", color: "#ea580c" },
    },
  },
  {
    name: "Gold",
    opts: {
      dotsOptions: { type: "classy-rounded", color: "#b45309" },
      backgroundOptions: { color: "#fff" },
      cornersSquareOptions: { type: "dot", color: "#92400e" },
      cornersDotOptions: { type: "dot", color: "#92400e" },
    },
  },
  {
    name: "Neon Cyber",
    opts: {
      dotsOptions: { type: "dots", color: "#06b6d4" },
      backgroundOptions: { color: "#0f172a" },
      cornersSquareOptions: { type: "extra-rounded", color: "#ec4899" },
      cornersDotOptions: { type: "dot", color: "#06b6d4" },
    },
  },
  {
    name: "Green Leaf",
    opts: {
      dotsOptions: { type: "rounded", color: "#16a34a" },
      backgroundOptions: { color: "#f0fdf4" },
      cornersSquareOptions: { type: "extra-rounded", color: "#15803d" },
      cornersDotOptions: { type: "dot", color: "#16a34a" },
    },
  },
  {
    name: "Minimal",
    opts: {
      dotsOptions: { type: "dots", color: "#334155" },
      backgroundOptions: { color: "#fff" },
      cornersSquareOptions: { type: "dot", color: "#0f172a" },
      cornersDotOptions: { type: "dot", color: "#0f172a" },
    },
  },
  {
    name: "Purple Pop",
    opts: {
      dotsOptions: { type: "classy", color: "#9333ea" },
      backgroundOptions: { color: "#faf5ff" },
      cornersSquareOptions: { type: "square", color: "#7e22ce" },
      cornersDotOptions: { type: "square", color: "#9333ea" },
    },
  },
  {
    name: "Dark Mode",
    opts: {
      dotsOptions: { type: "rounded", color: "#f8fafc" },
      backgroundOptions: { color: "#1e293b" },
      cornersSquareOptions: { type: "extra-rounded", color: "#e2e8f0" },
      cornersDotOptions: { type: "dot", color: "#f8fafc" },
    },
  },
  {
    name: "Red Alert",
    opts: {
      dotsOptions: { type: "square", color: "#dc2626" },
      backgroundOptions: { color: "#fef2f2" },
      cornersSquareOptions: { type: "square", color: "#991b1b" },
      cornersDotOptions: { type: "square", color: "#dc2626" },
    },
  },
  {
    name: "Soft Pink",
    opts: {
      dotsOptions: { type: "classy-rounded", color: "#db2777" },
      backgroundOptions: { color: "#fdf2f8" },
      cornersSquareOptions: { type: "extra-rounded", color: "#be185d" },
      cornersDotOptions: { type: "dot", color: "#db2777" },
    },
  },
  {
    name: "Tech",
    opts: {
      dotsOptions: { type: "square", color: "#0284c7" },
      backgroundOptions: { color: "#e0f2fe" },
      cornersSquareOptions: { type: "square", color: "#0369a1" },
      cornersDotOptions: { type: "square", color: "#0284c7" },
    },
  },
  {
    name: "Gradient Dots",
    opts: {
      dotsOptions: {
        type: "rounded",
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#4f46e5" },
            { offset: 1, color: "#ec4899" },
          ],
        },
      },
      backgroundOptions: { color: "#fff" },
      cornersSquareOptions: { type: "extra-rounded", color: "#4f46e5" },
      cornersDotOptions: { type: "dot", color: "#ec4899" },
    },
  },
  {
    name: "Gradient BG",
    opts: {
      dotsOptions: { type: "square", color: "#0f172a" },
      backgroundOptions: {
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#f8fafc" },
            { offset: 1, color: "#c7d2fe" },
          ],
        },
      },
      cornersSquareOptions: { type: "square", color: "#0f172a" },
      cornersDotOptions: { type: "square", color: "#0f172a" },
    },
  },
  {
    name: "Sunset Gradient",
    opts: {
      dotsOptions: {
        type: "classy-rounded",
        gradient: {
          type: "radial",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#f59e0b" },
            { offset: 1, color: "#ec4899" },
          ],
        },
      },
      backgroundOptions: {
        gradient: {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "#fff7ed" },
            { offset: 1, color: "#fce7f3" },
          ],
        },
      },
      cornersSquareOptions: { type: "extra-rounded", color: "#f59e0b" },
      cornersDotOptions: { type: "dot", color: "#ec4899" },
    },
  },
  {
    name: "Ocean",
    opts: {
      dotsOptions: {
        type: "rounded",
        gradient: {
          type: "linear",
          rotation: 0.785,
          colorStops: [
            { offset: 0, color: "#06b6d4" },
            { offset: 1, color: "#3b82f6" },
          ],
        },
      },
      backgroundOptions: { color: "#ecfeff" },
      cornersSquareOptions: { type: "extra-rounded", color: "#0891b2" },
      cornersDotOptions: { type: "dot", color: "#3b82f6" },
    },
  },
  {
    name: "Forest",
    opts: {
      dotsOptions: { type: "classy", color: "#15803d" },
      backgroundOptions: {
        gradient: {
          type: "linear",
          rotation: 1.57,
          colorStops: [
            { offset: 0, color: "#f0fdf4" },
            { offset: 1, color: "#bbf7d0" },
          ],
        },
      },
      cornersSquareOptions: { type: "extra-rounded", color: "#166534" },
      cornersDotOptions: { type: "dot", color: "#15803d" },
    },
  },
];

/* ════════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════════ */
const App = {
  // No-op stub so bindTabs can call it before bindTabScroll (bug fix #6)
  updateTabScrollHints: () => {},

  init() {
    // Bug fix #6: bindTabScroll first so updateTabScrollHints exists
    this.bindTabScroll();
    this.bindTabs();
    this.bindContent();
    this.bindStyle();
    this.bindColors();
    this.bindGradients();
    this.bindLogo();
    this.bindLayout();
    this.bindBorder();
    this.bindExport();
    this.renderTemplates();
    this.updateContent();
    Toast.show("Welcome to QRCraft", "success");
  },

  bindTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        document
          .querySelectorAll(".tab-content")
          .forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        document
          .getElementById(`tab-${btn.dataset.tab}`)
          .classList.add("active");
        btn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        this.updateTabScrollHints();
      });
    });
    document.querySelectorAll("#color-subtabs .sub-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        setColorSubview(tab.dataset.subtab);
        if (tab.dataset.subtab === "solid") {
          let disabledGradient = false;
          Object.keys(State.gradients).forEach((key) => {
            if (!State.gradients[key].enabled) return;
            State.gradients[key].enabled = false;
            document.getElementById(`grad-${key}-enabled`).checked = false;
            updateGradientPreview(key);
            disabledGradient = true;
          });
          if (disabledGradient) {
            syncSolidInputsFromState();
            updateLivePreview();
            Toast.show("Switched to solid colors", "success");
          }
        }
      });
    });
  },

  bindTabScroll() {
    const wrap = document.getElementById("tab-scroll-wrap");
    const tabs = document.getElementById("control-tabs");
    const update = () => {
      wrap.classList.toggle("can-scroll-left", tabs.scrollLeft > 4);
      wrap.classList.toggle(
        "can-scroll-right",
        tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 4,
      );
    };
    tabs.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    tabs.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          tabs.scrollLeft += e.deltaY;
        }
      },
      { passive: false },
    );
    setTimeout(update, 50);
    this.updateTabScrollHints = update;
  },

  updateContent() {
    const t = State.contentType;
    let d = "https://qrcraft.dev";
    const v = (id) => document.getElementById(id)?.value || "";
    if (t === "url") d = v("qr-url");
    else if (t === "text") d = v("qr-text");
    else if (t === "email")
      d = U.buildEmail(v("qr-email"), v("qr-email-sub"), v("qr-email-body"));
    else if (t === "phone")
      d = v("qr-phone") ? `tel:${v("qr-phone")}` : "https://qrcraft.dev";
    else if (t === "sms") d = U.buildSms(v("qr-sms-phone"), v("qr-sms-msg"));
    else if (t === "wifi")
      d = U.buildWiFi(v("qr-wifi-ssid"), v("qr-wifi-pass"), v("qr-wifi-type"));
    else if (t === "vcard")
      d = U.buildVCard(
        v("qr-vcard-name"),
        v("qr-vcard-phone"),
        v("qr-vcard-email"),
        v("qr-vcard-company"),
      );
    else if (t === "geo") d = U.buildGeo(v("qr-geo-lat"), v("qr-geo-lng"));
    else if (t === "event")
      d = U.buildEvent(
        v("qr-event-title"),
        v("qr-event-loc"),
        v("qr-event-start"),
        v("qr-event-end"),
      );
    else if (t === "whatsapp")
      d = U.buildWhatsApp(v("qr-wa-phone"), v("qr-wa-msg"));
    else if (t === "telegram") d = U.buildTelegram(v("qr-tg-user"));
    else if (t === "bitcoin")
      d = U.buildBitcoin(
        v("qr-btc-address"),
        v("qr-btc-amount"),
        v("qr-btc-label"),
      );
    else if (t === "otp")
      d = U.buildOtp(
        v("qr-otp-secret"),
        v("qr-otp-issuer"),
        v("qr-otp-account"),
      );
    else if (t === "facetime") d = U.buildFaceTime(v("qr-facetime"));
    else if (t === "mecard")
      d = U.buildMecard(
        v("qr-mecard-name"),
        v("qr-mecard-phone"),
        v("qr-mecard-email"),
        v("qr-mecard-org"),
      );
    State.qrOptions.data = d || "https://qrcraft.dev";
    updateLivePreview();
  },

  bindContent() {
    const moreOptions = document.getElementById("toggle-more-content-types");
    const extraTypes = [
      ...document.querySelectorAll("#content-type-options [data-more-option]"),
    ];
    let showAllTypes = false;
    const updateTypeOptions = () => {
      moreOptions.setAttribute("aria-expanded", String(showAllTypes));
      moreOptions.innerHTML = showAllTypes
        ? '<i class="ph ph-caret-up"></i> Show fewer options'
        : '<i class="ph ph-caret-down"></i> Show more options';
      extraTypes.forEach((button) => {
        button.classList.toggle(
          "hidden",
          !showAllTypes && !button.classList.contains("active"),
        );
      });
    };
    moreOptions.addEventListener("click", () => {
      showAllTypes = !showAllTypes;
      updateTypeOptions();
    });
    updateTypeOptions();

    document.querySelectorAll(".type-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".type-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        State.contentType = btn.dataset.type;
        document
          .querySelectorAll(".dynamic-input")
          .forEach((el) => el.classList.add("hidden"));
        document
          .getElementById(`input-${State.contentType}`)
          .classList.remove("hidden");
        this.updateContent();
      });
    });
    const ids = [
      "qr-url",
      "qr-text",
      "qr-email",
      "qr-email-sub",
      "qr-email-body",
      "qr-phone",
      "qr-sms-phone",
      "qr-sms-msg",
      "qr-wifi-ssid",
      "qr-wifi-pass",
      "qr-vcard-name",
      "qr-vcard-phone",
      "qr-vcard-email",
      "qr-vcard-company",
      "qr-geo-lat",
      "qr-geo-lng",
      "qr-event-title",
      "qr-event-loc",
      "qr-event-start",
      "qr-event-end",
      "qr-wa-phone",
      "qr-wa-msg",
      "qr-tg-user",
      "qr-btc-address",
      "qr-btc-amount",
      "qr-btc-label",
      "qr-otp-secret",
      "qr-otp-issuer",
      "qr-otp-account",
      "qr-facetime",
      "qr-mecard-name",
      "qr-mecard-phone",
      "qr-mecard-email",
      "qr-mecard-org",
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el)
        el.addEventListener(
          "input",
          U.debounce(() => this.updateContent(), 300),
        );
    });
    const wifiType = document.getElementById("qr-wifi-type");
    if (wifiType)
      wifiType.addEventListener("change", () => this.updateContent());
  },

  bindStyle() {
    const setupGrid = (gridId, target, prop) => {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      grid.querySelectorAll(".option-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          grid
            .querySelectorAll(".option-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          State.qrOptions[target][prop] = btn.dataset.val;
          updateLivePreview();
        });
      });
    };
    setupGrid("pattern-options", "dotsOptions", "type");
    setupGrid("corners-square-options", "cornersSquareOptions", "type");
    setupGrid("corners-dot-options", "cornersDotOptions", "type");

    document.getElementById("qr-shape").addEventListener("change", (e) => {
      State.qrOptions.shape = e.target.value;
      updateLivePreview();
    });
    document.getElementById("qr-type").addEventListener("change", (e) => {
      State.qrOptions.type = e.target.value;
      updateLivePreview();
    });
    document.getElementById("round-size").addEventListener("change", (e) => {
      State.qrOptions.dotsOptions.roundSize = e.target.checked;
      updateLivePreview();
    });

    const errSlider = document.getElementById("error-slider");
    const errLevels = ["L", "M", "Q", "H"];
    const errLabels = [
      "Low (7%)",
      "Medium (15%)",
      "Quartile (25%)",
      "High (30%)",
    ];
    errSlider.addEventListener("input", (e) => {
      const v = parseInt(e.target.value);
      document.getElementById("error-val").innerText = errLabels[v];
      State.qrOptions.qrOptions.errorCorrectionLevel = errLevels[v];
      updateLivePreview();
    });
  },

  bindColors() {
    // Bug fix: only wire inputs that actually exist. Corner text inputs don't exist in HTML.
    const setup = (inpId, txtId, key) => {
      const inp = document.getElementById(inpId);
      if (!inp) return;
      const txt = txtId ? document.getElementById(txtId) : null;
      const onChange = (v) => {
        State.solidColors[key] = v;
        // Auto-disable conflicting gradient
        if (key === "dots" && State.gradients.dots.enabled) {
          State.gradients.dots.enabled = false;
          document.getElementById("grad-dots-enabled").checked = false;
          updateGradientPreview("dots");
          Toast.show("Dots gradient disabled — using solid color", "info");
        }
        if (key === "bg" && State.gradients.bg.enabled) {
          State.gradients.bg.enabled = false;
          document.getElementById("grad-bg-enabled").checked = false;
          updateGradientPreview("bg");
          Toast.show(
            "Background gradient disabled — using solid color",
            "info",
          );
        }
        if (
          (key === "cornerSq" || key === "cornerDot") &&
          State.gradients.corner.enabled
        ) {
          State.gradients.corner.enabled = false;
          document.getElementById("grad-corner-enabled").checked = false;
          updateGradientPreview("corner");
          Toast.show("Corner gradient disabled — using solid color", "info");
        }
        updateLivePreview();
      };
      inp.addEventListener("input", (e) => {
        if (txt) txt.value = e.target.value;
        onChange(e.target.value);
      });
      if (txt)
        txt.addEventListener("change", (e) => {
          inp.value = e.target.value;
          onChange(e.target.value);
        });
    };
    setup("color-fg", "color-fg-text", "dots");
    setup("color-bg", "color-bg-text", "bg");
    setup("color-corner-sq", null, "cornerSq");
    setup("color-corner-dt", null, "cornerDot");

    document
      .getElementById("bg-transparent")
      .addEventListener("change", (e) => {
        State.transparentBg = e.target.checked;
        updateLivePreview();
      });

    document.getElementById("btn-sync-colors").addEventListener("click", () => {
      const c = State.solidColors.dots;
      State.solidColors.cornerSq = c;
      State.solidColors.cornerDot = c;
      if (State.gradients.corner.enabled) {
        State.gradients.corner.enabled = false;
        document.getElementById("grad-corner-enabled").checked = false;
        updateGradientPreview("corner");
      }
      syncSolidInputsFromState();
      updateLivePreview();
      Toast.show("Corners synced with foreground", "success");
    });
  },

  bindGradients() {
    bindGradientSection("dots");
    bindGradientSection("bg");
    bindGradientSection("corner");
  },

  bindLogo() {
    const logoGrid = document.getElementById("preloaded-logos");
    const removeLogoButton = document.getElementById("btn-remove-logo");
    const searchResults = document.getElementById("logo-search-results");
    const uploadInput = document.getElementById("logo-upload");
    const dropZone = document.getElementById("logo-drop-zone");
    const setLogo = (image, selectedButton = null) => {
      State.qrOptions.image = image;
      logoGrid
        .querySelectorAll(".option-btn")
        .forEach((item) => item.classList.remove("active"));
      searchResults
        .querySelectorAll("button")
        .forEach((item) => item.classList.remove("active"));
      if (selectedButton) selectedButton.classList.add("active");
      uploadInput.value = "";
      removeLogoButton.classList.remove("hidden");
      updateLivePreview();
    };

    const loadLogoFile = (file) => {
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml",
      ];
      if (!validTypes.includes(file.type)) {
        uploadInput.value = "";
        Toast.show("Choose a PNG, JPEG, WebP, or SVG image", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        uploadInput.value = "";
        Toast.show("Logo too large (max 2MB)", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target.result !== "string") {
          Toast.show("Could not read logo file", "error");
          return;
        }
        setLogo(event.target.result);
        Toast.show("Logo uploaded", "success");
      };
      reader.onerror = () => Toast.show("Could not read logo file", "error");
      reader.readAsDataURL(file);
    };

    PRELOADED_LOGOS.forEach(({ name, url }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "option-btn flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-white p-1 transition-colors hover:border-slate-300 hover:bg-slate-50 [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&.active]:border-indigo-600 [&.active]:bg-indigo-100 cursor-pointer";
      button.title = name;
      button.setAttribute("aria-label", `Use ${name} logo`);
      const image = document.createElement("img");
      image.alt = name;
      image.crossOrigin = "anonymous";
      image.addEventListener(
        "error",
        () =>
          Toast.show(
            `Could not load "${name}". Check the PNG URL and its CORS settings.`,
            "error",
          ),
        { once: true },
      );
      image.src = url;
      button.appendChild(image);
      button.addEventListener("click", () => {
        logoGrid
          .querySelectorAll(".option-btn")
          .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        setLogo(url, button);
      });
      logoGrid.appendChild(button);
    });
    uploadInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) loadLogoFile(file);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add("dragging");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove("dragging");
      });
    });
    dropZone.addEventListener("drop", (event) => {
      const file = event.dataTransfer.files[0];
      if (file) loadLogoFile(file);
    });

    let searchController = null;
    document
      .getElementById("logo-search-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = document.getElementById("logo-search-input").value.trim();
        const status = document.getElementById("logo-search-status");
        const searchButton = document.getElementById("logo-search-button");
        if (query.length < 2) {
          status.textContent = "Enter at least 2 characters to search.";
          return;
        }

        if (searchController) searchController.abort();
        searchController = new AbortController();
        const controller = searchController;
        searchButton.disabled = true;
        searchResults.replaceChildren();
        status.textContent = "Searching Simple Icons…";
        try {
          const params = new URLSearchParams({
            query,
            limit: "24",
            prefix: "simple-icons",
          });
          const response = await fetch(
            `https://api.iconify.design/search?${params}`,
            { signal: controller.signal },
          );
          if (!response.ok) {
            throw new Error(`Logo search failed (${response.status}).`);
          }
          const data = await response.json();
          if (!Array.isArray(data.icons)) {
            throw new Error("Logo search returned an invalid response.");
          }
          const iconNames = data.icons.filter((icon) =>
            /^simple-icons:[a-z0-9-]+$/.test(icon),
          );
          if (!iconNames.length) {
            status.textContent = `No logos found for “${query}”.`;
            return;
          }

          status.textContent = `${iconNames.length} logos found. Select one to use it.`;
          iconNames.forEach((iconName) => {
            const name = iconName.slice("simple-icons:".length);
            const button = document.createElement("button");
            button.type = "button";
            button.className =
              "option-btn flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-gray-100 p-2 text-center text-[0.65rem] text-black";
            button.title = `Use ${name} logo`;
            button.setAttribute("aria-label", `Use ${name} logo`);
            const image = document.createElement("img");
            image.alt = "";
            image.crossOrigin = "anonymous";
            image.src = `https://api.iconify.design/simple-icons/${name}.svg`;
            const label = document.createElement("span");
            label.className = "max-w-full truncate";
            label.textContent = name.replaceAll("-", " ");
            button.append(image, label);
            button.addEventListener("click", async () => {
              button.disabled = true;
              try {
                const logoResponse = await fetch(
                  `https://api.iconify.design/simple-icons/${name}.svg?color=%230f172a`,
                );
                if (!logoResponse.ok) {
                  throw new Error(
                    `Could not load the ${name} logo (${logoResponse.status}).`,
                  );
                }
                const svg = await logoResponse.text();
                if (
                  svg.length > 1024 * 1024 ||
                  !svg.includes("<svg") ||
                  !svg.includes("</svg>")
                ) {
                  throw new Error("The logo service returned an invalid SVG.");
                }
                setLogo(
                  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
                  button,
                );
                uploadInput.value = "";
                Toast.show(`${name} logo added`, "success");
              } catch (error) {
                console.error("Could not load searched logo:", error);
                Toast.show(
                  error instanceof Error
                    ? error.message
                    : "Could not load the selected logo.",
                  "error",
                );
              } finally {
                button.disabled = false;
              }
            });
            searchResults.appendChild(button);
          });
        } catch (error) {
          if (error.name === "AbortError") return;
          console.error("Logo search failed:", error);
          status.textContent =
            "Logo search failed. Check your connection and try again.";
          Toast.show(
            error instanceof Error
              ? error.message
              : "Logo search failed. Try again.",
            "error",
          );
        } finally {
          if (searchController === controller) {
            searchButton.disabled = false;
            searchController = null;
          }
        }
      });

    document.getElementById("btn-remove-logo").addEventListener("click", () => {
      State.qrOptions.image = "";
      uploadInput.value = "";
      logoGrid
        .querySelectorAll(".option-btn")
        .forEach((item) => item.classList.remove("active"));
      searchResults
        .querySelectorAll("button")
        .forEach((item) => item.classList.remove("active"));
      document.getElementById("btn-remove-logo").classList.add("hidden");
      updateLivePreview();
      Toast.show("Logo removed", "info");
    });
    document.getElementById("logo-size").addEventListener("input", (e) => {
      document.getElementById("logo-size-val").innerText =
        Math.round(e.target.value * 100) + "%";
      State.qrOptions.imageOptions.imageSize = parseFloat(e.target.value);
      updateLivePreview();
    });
    document.getElementById("logo-margin").addEventListener("input", (e) => {
      document.getElementById("logo-margin-val").innerText =
        e.target.value + "px";
      State.qrOptions.imageOptions.margin = parseInt(e.target.value);
      updateLivePreview();
    });
    document.getElementById("logo-bg-hide").addEventListener("change", (e) => {
      State.qrOptions.imageOptions.hideBackgroundDots = e.target.checked;
      updateLivePreview();
    });
    document
      .getElementById("logo-save-blob")
      .addEventListener("change", (e) => {
        State.qrOptions.imageOptions.saveAsBlob = e.target.checked;
      });
  },

  bindLayout() {
    document.getElementById("layout-width").addEventListener("input", (e) => {
      document.getElementById("layout-width-val").innerText =
        e.target.value + "px";
      State.qrOptions.width = State.qrOptions.height = parseInt(e.target.value);
      updateLivePreview();
    });

    // Bug fix #9: single setMargin that clamps and always reflects actual state
    const marginSlider = document.getElementById("layout-margin");
    const marginNum = document.getElementById("layout-margin-num");
    const setMargin = (raw, source) => {
      const v = Math.max(0, Math.min(800, isNaN(raw) ? 0 : raw));
      State.qrOptions.margin = v;
      document.getElementById("layout-margin-val").innerText = v + "px";
      if (source !== "slider") marginSlider.value = Math.min(400, v);
      if (source !== "num") marginNum.value = v;
      updateLivePreview();
    };
    marginSlider.addEventListener("input", (e) =>
      setMargin(parseInt(e.target.value), "slider"),
    );
    marginNum.addEventListener("input", (e) =>
      setMargin(parseInt(e.target.value), "num"),
    );

    document
      .getElementById("layout-typenumber")
      .addEventListener("change", (e) => {
        State.qrOptions.qrOptions.typeNumber = parseInt(e.target.value) || 0;
        updateLivePreview();
      });
    document.getElementById("layout-mode").addEventListener("change", (e) => {
      State.qrOptions.qrOptions.mode = e.target.value;
      updateLivePreview();
    });
  },

  bindBorder() {
    const bindValue = (id, key, eventName = "input") => {
      document.getElementById(id).addEventListener(eventName, (event) => {
        if (event.target.type === "number") {
          State.border[key] = Math.max(
            8,
            Math.min(96, parseInt(event.target.value, 10) || 8),
          );
          event.target.value = State.border[key];
        } else {
          State.border[key] =
            event.target.type === "range" &&
            (key === "thickness" || key === "round")
              ? parseFloat(event.target.value)
              : event.target.value;
        }
        updateLivePreview();
      });
    };

    document
      .getElementById("border-enabled")
      .addEventListener("change", (event) => {
        State.border.enabled = event.target.checked;
        updateLivePreview();
      });
    bindValue("border-color", "color");
    bindValue("border-dash", "dasharray", "change");
    bindValue("border-round", "round");
    document
      .getElementById("border-thickness")
      .addEventListener("input", (event) => {
        State.border.thickness = parseInt(event.target.value, 10);
        document.getElementById("border-thickness-value").textContent =
          `${State.border.thickness}px`;
        updateLivePreview();
      });

    ["inner", "outer"].forEach((side) => {
      const config = State.border[side];
      document
        .getElementById(`border-${side}-enabled`)
        .addEventListener("change", (event) => {
          config.enabled = event.target.checked;
          updateLivePreview();
        });
      document
        .getElementById(`border-${side}-color`)
        .addEventListener("input", (event) => {
          config.color = event.target.value;
          updateLivePreview();
        });
      document
        .getElementById(`border-${side}-thickness`)
        .addEventListener("input", (event) => {
          config.thickness = parseInt(event.target.value, 10);
          document.getElementById(
            `border-${side}-thickness-value`,
          ).textContent = `${config.thickness}px`;
          updateLivePreview();
        });
    });

    ["top", "right", "bottom", "left"].forEach((position) => {
      document
        .getElementById(`border-decoration-${position}`)
        .addEventListener("input", (event) => {
          State.border.decorations[position] = event.target.value;
          updateLivePreview();
        });
    });
    bindValue("border-text-color", "textColor");
    bindValue("border-text-size", "textSize");
  },

  bindExport() {
    const downloadActions = document.getElementById("download-actions");
    const downloadMenu = document.getElementById("download-menu");
    const downloadMenuToggle = document.getElementById(
      "btn-download-menu-toggle",
    );
    const closeDownloadMenu = () => {
      downloadMenu.classList.add("hidden");
      downloadMenuToggle.setAttribute("aria-expanded", "false");
    };
    downloadMenuToggle.addEventListener("click", () => {
      const isOpen = !downloadMenu.classList.contains("hidden");
      downloadMenu.classList.toggle("hidden", isOpen);
      downloadMenuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
    document.addEventListener("click", (event) => {
      if (!downloadActions.contains(event.target)) closeDownloadMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDownloadMenu();
    });

    document.getElementById("export-size").addEventListener("input", (e) => {
      document.getElementById("export-size-val").innerText =
        e.target.value + "px";
    });
    document
      .getElementById("btn-download")
      .addEventListener("click", async () => {
        const b = document.getElementById("btn-download");
        b.disabled = true;
        b.innerHTML =
          '<i class="ph ph-circle-notch animate-spin"></i> Generating...';
        try {
          await Renderer.triggerDownload();
          Toast.show("QR code downloaded successfully", "success");
        } catch (err) {
          console.error(err);
          Toast.show(
            "Export failed. Try a smaller size or remove the logo.",
            "error",
          );
        } finally {
          b.disabled = false;
          b.innerHTML = '<i class="ph ph-download-simple"></i> Download';
        }
      });
    document.getElementById("btn-reset").addEventListener("click", () => {
      Modal.show({
        title: "Reset design?",
        body: "This will clear all customizations and restore the default QR code. This action cannot be undone.",
        type: "danger",
        confirmText: "Reset",
        onConfirm: () => location.reload(),
      });
    });
    document
      .getElementById("btn-randomize")
      .addEventListener("click", () => this.randomizeDesign());
    const copyButton = document.getElementById("btn-copy-qr");
    copyButton.addEventListener("click", async () => {
      closeDownloadMenu();
      copyButton.disabled = true;
      try {
        await Renderer.copyToClipboard();
        Toast.show("QR image copied to clipboard", "success");
      } catch (err) {
        console.error("QR clipboard copy failed:", err);
        Toast.show(
          err instanceof Error
            ? err.message
            : "Could not copy the QR image to the clipboard.",
          "error",
        );
      } finally {
        copyButton.disabled = false;
      }
    });
  },

  randomizeDesign() {
    const pick = (values) => values[Math.floor(Math.random() * values.length)];
    const palette = pick(RANDOM_DESIGN_PALETTES);
    State.solidColors.dots = palette.dots;
    State.solidColors.bg = palette.background;
    State.solidColors.cornerSq = palette.accent;
    State.solidColors.cornerDot = palette.accent;
    State.transparentBg = false;

    Object.keys(State.gradients).forEach((key) => {
      State.gradients[key].enabled = false;
      document.getElementById(`grad-${key}-enabled`).checked = false;
      updateGradientPreview(key);
    });

    const chooseStyle = (gridId, optionKey) => {
      const options = [...document.querySelectorAll(`#${gridId} .option-btn`)];
      const selected = pick(options);
      State.qrOptions[optionKey].type = selected.dataset.val;
    };
    chooseStyle("pattern-options", "dotsOptions");
    chooseStyle("corners-square-options", "cornersSquareOptions");
    chooseStyle("corners-dot-options", "cornersDotOptions");
    State.qrOptions.shape = pick(["square", "circle"]);
    if (State.qrOptions.image) {
      State.qrOptions.qrOptions.errorCorrectionLevel = "H";
    }

    document.getElementById("bg-transparent").checked = false;
    setColorSubview("solid");
    this.syncUIFromState();
    updateLivePreview();
    Toast.show("Generated a new QR design", "success");
  },

  renderTemplates() {
    const c = document.getElementById("templates-container");
    TemplatesData.forEach((t) => {
      const previewOpts = JSON.parse(JSON.stringify(t.opts));
      const tmp = new QRCodeStyling({
        width: 140,
        height: 140,
        data: "https://qrcraft.dev",
        margin: 4,
        ...previewOpts,
      });
      const card = document.createElement("div");
      card.className = "template-card";
      const wrap = document.createElement("div");
      tmp.append(wrap);
      setTimeout(() => {
        const cv = wrap.querySelector("canvas");
        if (cv) {
          const img = document.createElement("img");
          img.src = cv.toDataURL();
          card.innerHTML = "";
          card.appendChild(img);
          const n = document.createElement("div");
          n.className = "template-name";
          n.innerText = t.name;
          card.appendChild(n);
        }
      }, 120);
      card.addEventListener("click", () => {
        // Turn off all gradients
        Object.keys(State.gradients).forEach((k) => {
          State.gradients[k].enabled = false;
          const cb = document.getElementById(`grad-${k}-enabled`);
          if (cb) cb.checked = false;
          updateGradientPreview(k);
        });

        // Bug fix #8: templates write to State.solidColors, not qrOptions
        if (t.opts.dotsOptions?.color)
          State.solidColors.dots = t.opts.dotsOptions.color;
        if (t.opts.backgroundOptions?.color)
          State.solidColors.bg = t.opts.backgroundOptions.color;
        if (t.opts.cornersSquareOptions?.color)
          State.solidColors.cornerSq = t.opts.cornersSquareOptions.color;
        if (t.opts.cornersDotOptions?.color)
          State.solidColors.cornerDot = t.opts.cornersDotOptions.color;

        // Apply types — bug fix #3 & #4: guard undefined and preserve roundSize
        [
          "dotsOptions",
          "backgroundOptions",
          "cornersSquareOptions",
          "cornersDotOptions",
        ].forEach((key) => {
          const opts = t.opts[key] || {};
          const { color, gradient, ...rest } = opts; // strip color/gradient; they go through solidColors
          const merged = { ...State.qrOptions[key], ...rest };
          // dotsOptions must keep roundSize from State (template doesn't include it)
          if (key === "dotsOptions")
            merged.roundSize = State.qrOptions.dotsOptions.roundSize;
          State.qrOptions[key] = merged;
        });

        this.syncUIFromState();
        updateLivePreview();
        Toast.show(`Applied "${t.name}"`, "success");
      });
      c.appendChild(card);
    });
  },

  syncUIFromState() {
    const syncGrid = (gridId, val) => {
      const g = document.getElementById(gridId);
      if (!g) return;
      g.querySelectorAll(".option-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.val === val),
      );
    };
    syncGrid("pattern-options", State.qrOptions.dotsOptions.type);
    syncGrid(
      "corners-square-options",
      State.qrOptions.cornersSquareOptions.type,
    );
    syncGrid("corners-dot-options", State.qrOptions.cornersDotOptions.type);
    syncSolidInputsFromState();
    document.getElementById("qr-shape").value = State.qrOptions.shape;
    document.getElementById("qr-type").value = State.qrOptions.type;
    document.getElementById("round-size").checked =
      State.qrOptions.dotsOptions.roundSize;
    document.getElementById("bg-transparent").checked = State.transparentBg;
    const errorLevels = ["L", "M", "Q", "H"];
    const errorLabels = [
      "Low (7%)",
      "Medium (15%)",
      "Quartile (25%)",
      "High (30%)",
    ];
    const errorIndex = errorLevels.indexOf(
      State.qrOptions.qrOptions.errorCorrectionLevel,
    );
    if (errorIndex >= 0) {
      document.getElementById("error-slider").value = errorIndex;
      document.getElementById("error-val").textContent =
        errorLabels[errorIndex];
    }
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
