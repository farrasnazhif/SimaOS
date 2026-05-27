<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SimaOS Operator Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary": "#b7c8e1",
                    "error": "#ffb4ab",
                    "primary-container": "#4d8eff",
                    "surface-tint": "#adc6ff",
                    "surface-container-lowest": "#060e20",
                    "on-secondary-fixed": "#0b1c30",
                    "surface-container": "#171f33",
                    "tertiary-fixed-dim": "#ffb786",
                    "on-tertiary": "#502400",
                    "secondary-fixed-dim": "#b7c8e1",
                    "on-surface-variant": "#c2c6d6",
                    "on-secondary-fixed-variant": "#38485d",
                    "on-primary-container": "#00285d",
                    "outline-variant": "#424754",
                    "surface": "#0b1326",
                    "surface-variant": "#2d3449",
                    "secondary-container": "#3a4a5f",
                    "on-error-container": "#ffdad6",
                    "on-background": "#dae2fd",
                    "on-tertiary-fixed": "#311400",
                    "primary-fixed": "#d8e2ff",
                    "on-primary": "#002e6a",
                    "surface-container-low": "#131b2e",
                    "outline": "#8c909f",
                    "surface-bright": "#31394d",
                    "surface-container-high": "#222a3d",
                    "primary-fixed-dim": "#adc6ff",
                    "on-surface": "#dae2fd",
                    "tertiary": "#ffb786",
                    "tertiary-container": "#df7412",
                    "inverse-primary": "#005ac2",
                    "inverse-surface": "#dae2fd",
                    "on-tertiary-container": "#461f00",
                    "error-container": "#93000a",
                    "background": "#0b1326",
                    "on-error": "#690005",
                    "secondary-fixed": "#d3e4fe",
                    "inverse-on-surface": "#283044",
                    "primary": "#adc6ff",
                    "on-tertiary-fixed-variant": "#723600",
                    "surface-dim": "#0b1326",
                    "on-primary-fixed-variant": "#004395",
                    "surface-container-highest": "#2d3449",
                    "tertiary-fixed": "#ffdcc6",
                    "on-primary-fixed": "#001a42",
                    "on-secondary-container": "#a9bad3",
                    "on-secondary": "#213145"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "density-comfortable": "12px",
                    "margin-desktop": "24px",
                    "gutter": "16px",
                    "unit": "4px",
                    "density-compact": "4px",
                    "margin-mobile": "16px"
            },
            "fontFamily": {
                    "display-lg": ["Inter"],
                    "data-mono": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-sm": ["Inter"],
                    "label-caps": ["Inter"],
                    "body-sm": ["Inter"],
                    "headline-md": ["Inter"]
            },
            "fontSize": {
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                    "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                    "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0b1326;
            color: #dae2fd;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #0b1326;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 2px;
        }
        .table-row-highlight::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: transparent;
            transition: background-color 0.2s;
        }
        .table-row-highlight:hover::before {
            background-color: #adc6ff;
        }
    </style>
</head>
<body class="overflow-hidden">
<!-- SideNavBar Shell -->
<aside class="flex flex-col h-full fixed left-0 top-0 z-40 h-screen w-64 border-r border-outline-variant bg-surface">
<div class="p-6">
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary">SimaOS</h1>
<p class="font-body-sm text-body-sm text-on-surface-variant">Precision Manufacturing</p>
</div>
<nav class="flex-1 px-2 space-y-1">
<!-- Active: Dashboard -->
<a class="flex items-center text-primary font-bold border-l-4 border-primary bg-primary-container/10 px-4 py-3 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined mr-3">dashboard</span>
<span class="font-body-md text-body-md">Dashboard</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98]" href="#">
<span class="material-symbols-outlined mr-3">factory</span>
<span class="font-body-md text-body-md">Live Batches</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98]" href="#">
<span class="material-symbols-outlined mr-3">timeline</span>
<span class="font-body-md text-body-md">Traceability</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98]" href="#">
<span class="material-symbols-outlined mr-3">verified_user</span>
<span class="font-body-md text-body-md">Quality Control</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98]" href="#">
<span class="material-symbols-outlined mr-3">settings_suggest</span>
<span class="font-body-md text-body-md">Maintenance</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98]" href="#">
<span class="material-symbols-outlined mr-3">settings</span>
<span class="font-body-md text-body-md">System Settings</span>
</a>
</nav>
<div class="p-4 mt-auto border-t border-outline-variant">
<button class="w-full text-left font-label-caps text-label-caps tracking-widest text-secondary mb-4 uppercase">Switch Role: Manager</button>
<div class="space-y-1">
<a class="flex items-center text-on-surface-variant px-4 py-2 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined mr-3">help</span>
<span class="font-body-sm text-body-sm">Support</span>
</a>
<a class="flex items-center text-on-surface-variant px-4 py-2 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined mr-3">logout</span>
<span class="font-body-sm text-body-sm">Log Out</span>
</a>
</div>
</div>
</aside>
<!-- TopAppBar Shell -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 ml-64 bg-surface border-b border-outline-variant">
<div class="flex items-center gap-6">
<h2 class="font-headline-sm text-headline-sm font-extrabold text-on-surface whitespace-nowrap">SimaOS Manufacturing</h2>
<div class="relative w-96">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Search Lots, Batches, or Materials..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span class="material-symbols-outlined">hub</span>
</button>
<div class="flex items-center gap-2 pl-4 border-l border-outline-variant">
<span class="text-right">
<p class="font-body-sm font-semibold text-on-surface leading-none">A. Petrov</p>
<p class="text-[10px] text-on-surface-variant uppercase tracking-tighter">Senior Operator</p>
</span>
<span class="material-symbols-outlined text-[32px] text-on-surface-variant">account_circle</span>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 p-margin-desktop overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
<!-- Header Actions Section -->
<div class="flex justify-between items-end mb-8">
<div>
<nav class="flex items-center gap-2 text-label-caps text-on-surface-variant mb-2">
<span>INVENTORY</span>
<span class="material-symbols-outlined text-[12px]">chevron_right</span>
<span class="text-primary">RAW MATERIALS</span>
</nav>
<h3 class="font-headline-md text-headline-md text-on-surface">Incoming Lots</h3>
<p class="font-body-sm text-on-surface-variant max-w-lg">Manage incoming material lots, quality certifications, and batch initialization for production lines.</p>
</div>
<button class="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-headline-sm text-[14px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
<span class="material-symbols-outlined">add_box</span>
                CREATE BATCH
            </button>
</div>
<!-- Metric Grid -->
<div class="grid grid-cols-4 gap-gutter mb-8">
<div class="bg-surface-container border border-outline-variant p-4 rounded-lg relative overflow-hidden group">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-on-surface-variant">PENDING QC</span>
<span class="material-symbols-outlined text-tertiary">hourglass_empty</span>
</div>
<p class="font-display-lg text-display-lg text-on-surface">12</p>
<div class="flex items-center gap-1 text-[12px] text-tertiary mt-2">
<span class="material-symbols-outlined text-[14px]">trending_up</span>
<span>+2 from yesterday</span>
</div>
<div class="absolute bottom-0 left-0 w-full h-0.5 bg-tertiary-container group-hover:h-1 transition-all"></div>
</div>
<div class="bg-surface-container border border-outline-variant p-4 rounded-lg relative overflow-hidden group">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-on-surface-variant">APPROVED TODAY</span>
<span class="material-symbols-outlined text-primary">check_circle</span>
</div>
<p class="font-display-lg text-display-lg text-on-surface">48</p>
<div class="flex items-center gap-1 text-[12px] text-primary mt-2">
<span class="material-symbols-outlined text-[14px]">verified</span>
<span>99.2% Compliance</span>
</div>
<div class="absolute bottom-0 left-0 w-full h-0.5 bg-primary group-hover:h-1 transition-all"></div>
</div>
<div class="bg-surface-container border border-outline-variant p-4 rounded-lg relative overflow-hidden group">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-on-surface-variant">REJECTION RATE</span>
<span class="material-symbols-outlined text-error">error</span>
</div>
<p class="font-display-lg text-display-lg text-on-surface">0.8<span class="text-headline-md">%</span></p>
<div class="flex items-center gap-1 text-[12px] text-error mt-2">
<span class="material-symbols-outlined text-[14px]">arrow_downward</span>
<span>-0.4% this week</span>
</div>
<div class="absolute bottom-0 left-0 w-full h-0.5 bg-error group-hover:h-1 transition-all"></div>
</div>
<div class="bg-surface-container border border-outline-variant p-4 rounded-lg relative overflow-hidden group">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-on-surface-variant">TOTAL STOCK VALUE</span>
<span class="material-symbols-outlined text-secondary">database</span>
</div>
<p class="font-display-lg text-display-lg text-on-surface">$1.2M</p>
<div class="flex items-center gap-1 text-[12px] text-on-surface-variant mt-2">
<span class="material-symbols-outlined text-[14px]">update</span>
<span>Updated 2m ago</span>
</div>
<div class="absolute bottom-0 left-0 w-full h-0.5 bg-secondary group-hover:h-1 transition-all"></div>
</div>
</div>
<!-- Lots List Table Section -->
<div class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
<div class="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/50">
<div class="flex items-center gap-4">
<h4 class="font-headline-sm text-headline-sm text-on-surface">Lots List</h4>
<span class="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded font-data-mono text-[11px]">84 TOTAL ENTRIES</span>
</div>
<div class="flex gap-2">
<button class="flex items-center gap-1 border border-outline-variant px-3 py-1.5 rounded text-body-sm hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-[18px]">filter_list</span>
                        Filter
                    </button>
<button class="flex items-center gap-1 border border-outline-variant px-3 py-1.5 rounded text-body-sm hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-[18px]">file_download</span>
                        Export CSV
                    </button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-highest/30 border-b border-outline-variant">
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider">Lot ID</th>
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider">Material</th>
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider">Supplier</th>
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider text-right">Arrival Date</th>
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider text-center">Status</th>
<th class="px-6 py-3 font-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/30">
<!-- Table Row 1 -->
<tr class="table-row-highlight relative hover:bg-surface-bright/20 transition-colors">
<td class="px-6 py-4 font-data-mono text-primary font-bold">LOT-2026-001</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[18px]">spa</span>
</div>
<span class="font-body-md font-semibold">Turmeric (Grade A)</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">SpiceSource Global Ltd.</td>
<td class="px-6 py-4 font-data-mono text-right text-body-sm">2026-10-12</td>
<td class="px-6 py-4">
<div class="flex justify-center">
<span class="px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        Approved
                                    </span>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<!-- Table Row 2 -->
<tr class="table-row-highlight relative hover:bg-surface-bright/20 transition-colors">
<td class="px-6 py-4 font-data-mono text-primary font-bold">LOT-2026-002</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">nutrition</span>
</div>
<span class="font-body-md font-semibold">Ginger Root</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">Andean Harvest Co.</td>
<td class="px-6 py-4 font-data-mono text-right text-body-sm">2026-10-14</td>
<td class="px-6 py-4">
<div class="flex justify-center">
<span class="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-fixed-dim border border-tertiary-container/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        In QC
                                    </span>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<!-- Table Row 3 -->
<tr class="table-row-highlight relative hover:bg-surface-bright/20 transition-colors">
<td class="px-6 py-4 font-data-mono text-primary font-bold">LOT-2026-003</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-tertiary-container/20 flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[18px]">spa</span>
</div>
<span class="font-body-md font-semibold">Turmeric (Grade B)</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">SpiceSource Global Ltd.</td>
<td class="px-6 py-4 font-data-mono text-right text-body-sm">2026-10-15</td>
<td class="px-6 py-4">
<div class="flex justify-center">
<span class="px-2 py-1 rounded bg-error/10 text-error border border-error/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-error"></span>
                                        Rejected
                                    </span>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<!-- Table Row 4 -->
<tr class="table-row-highlight relative hover:bg-surface-bright/20 transition-colors">
<td class="px-6 py-4 font-data-mono text-primary font-bold">LOT-2026-004</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[18px]">grain</span>
</div>
<span class="font-body-md font-semibold">Organic Peppercorn</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">Kerala Estates</td>
<td class="px-6 py-4 font-data-mono text-right text-body-sm">2026-10-15</td>
<td class="px-6 py-4">
<div class="flex justify-center">
<span class="px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                        Approved
                                    </span>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
<!-- Table Row 5 -->
<tr class="table-row-highlight relative hover:bg-surface-bright/20 transition-colors">
<td class="px-6 py-4 font-data-mono text-primary font-bold">LOT-2026-005</td>
<td class="px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded bg-secondary-container/20 flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">nutrition</span>
</div>
<span class="font-body-md font-semibold">Ginger Root</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">Andean Harvest Co.</td>
<td class="px-6 py-4 font-data-mono text-right text-body-sm">2026-10-16</td>
<td class="px-6 py-4">
<div class="flex justify-center">
<span class="px-2 py-1 rounded bg-tertiary-container/10 text-tertiary-fixed-dim border border-tertiary-container/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                        In QC
                                    </span>
</div>
</td>
<td class="px-6 py-4 text-right">
<button class="p-1 hover:text-primary transition-colors"><span class="material-symbols-outlined">more_vert</span></button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer / Pagination -->
<div class="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-low/50">
<span class="text-body-sm text-on-surface-variant">Showing 5 of 84 lots</span>
<div class="flex gap-1">
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant disabled:opacity-50" disabled="">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-data-mono text-body-sm">1</button>
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant font-data-mono text-body-sm">2</button>
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant font-data-mono text-body-sm">3</button>
<button class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- AI Insights & Secondary Feed Section -->
<div class="grid grid-cols-3 gap-gutter mt-8">
<div class="col-span-2 bg-surface-container border border-outline-variant p-6 rounded-lg">
<div class="flex justify-between items-center mb-6">
<h5 class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                        AI Anomaly Detection
                    </h5>
<span class="text-primary font-label-caps bg-primary/10 px-2 py-0.5 rounded">SYSTEM HEALTH: OPTIMAL</span>
</div>
<div class="space-y-4">
<div class="flex gap-4 p-4 rounded bg-surface-bright/10 border-l-4 border-tertiary">
<div class="mt-1"><span class="material-symbols-outlined text-tertiary">warning</span></div>
<div>
<p class="font-body-md font-semibold text-on-surface">Potential Temperature Fluctuation Detected</p>
<p class="font-body-sm text-on-surface-variant">Cold Storage Unit 4 is showing a 0.5°C drift outside the standard range for Ginger Root. Recommend checking seal integrity.</p>
</div>
</div>
<div class="flex gap-4 p-4 rounded bg-surface-bright/10 border-l-4 border-primary">
<div class="mt-1"><span class="material-symbols-outlined text-primary">info</span></div>
<div>
<p class="font-body-md font-semibold text-on-surface">Inventory Efficiency Suggestion</p>
<p class="font-body-sm text-on-surface-variant">Predictive model suggests initializing LOT-2026-001 immediately to align with the cleaning cycle of Extractor 3 scheduled for 18:00.</p>
</div>
</div>
</div>
</div>
<div class="bg-surface-container border border-outline-variant p-6 rounded-lg">
<h5 class="font-headline-sm text-headline-sm text-on-surface mb-6">Live Factory Cam</h5>
<div class="relative aspect-video bg-black rounded overflow-hidden">
<img class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" data-alt="A high-definition industrial surveillance view of a modern manufacturing floor. Large stainless steel vats and precision machinery are illuminated by cool, clinical blue and white lighting. Technical overlays of data points and health metrics are subtly integrated into the frame, creating a sophisticated digital twin aesthetic. The atmosphere is quiet, controlled, and intensely technological, reflecting absolute reliability and analytical precision." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj7L98Ix3Pvq17JwVkSwemzLhe4VBTELx53AJeB-Eov17ofZPfNMHF9UExyZxH-op17XOzaxUYvIGznVx1TprW7QiNhOzJbfblLavtvx-sxDEzbfSNZd4TieuhNKJwnlVXcuKW6dhwPY53G3az2OFjXLCo9VgMUwzdkwADcF0HWNoqULMPn_tY1gSamwGtSqR_r5-TESONagNkHoj9T8fLpAgx26Lsmc9UZ3fo5d36EV8OAYDoOzJgHgW1BvaV7oGRkIndKjBWVLFs"/>
<div class="absolute top-3 left-3 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span class="text-[10px] font-bold text-white uppercase bg-black/40 px-1.5 py-0.5 backdrop-blur-sm rounded">REC LINE 4</span>
</div>
<div class="absolute bottom-3 right-3">
<span class="material-symbols-outlined text-white/50 text-[20px]">fullscreen</span>
</div>
</div>
<div class="mt-4 flex flex-col gap-2">
<div class="flex justify-between items-center text-[11px] text-on-surface-variant">
<span>Active Batch: B-4992</span>
<span>Phase: Extraction</span>
</div>
<div class="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-primary w-[72%]"></div>
</div>
</div>
</div>
</div>
</main>
<script>
        // Micro-interactions for industrial feel
        document.querySelectorAll('.active\\:scale-\\[0\\.98\\]').forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('scale-[0.98]');
            });
            button.addEventListener('mouseup', () => {
                button.classList.remove('scale-[0.98]');
            });
            button.addEventListener('mouseleave', () => {
                button.classList.remove('scale-[0.98]');
            });
        });

        // Simulating some dynamic status changes or alerts
        setInterval(() => {
            const timeElements = document.querySelectorAll('.font-data-mono.text-right');
            // This is just a visual placeholder to suggest "Live" data
        }, 30000);
    </script>

</body></html>

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SimaOS | Manager Operations Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary": "#b7c8e1",
                        "error": "#ffb4ab",
                        "primary-container": "#4d8eff",
                        "surface-tint": "#adc6ff",
                        "surface-container-lowest": "#060e20",
                        "on-secondary-fixed": "#0b1c30",
                        "surface-container": "#171f33",
                        "tertiary-fixed-dim": "#ffb786",
                        "on-tertiary": "#502400",
                        "secondary-fixed-dim": "#b7c8e1",
                        "on-surface-variant": "#c2c6d6",
                        "on-secondary-fixed-variant": "#38485d",
                        "on-primary-container": "#00285d",
                        "outline-variant": "#424754",
                        "surface": "#0b1326",
                        "surface-variant": "#2d3449",
                        "secondary-container": "#3a4a5f",
                        "on-error-container": "#ffdad6",
                        "on-background": "#dae2fd",
                        "on-tertiary-fixed": "#311400",
                        "primary-fixed": "#d8e2ff",
                        "on-primary": "#002e6a",
                        "surface-container-low": "#131b2e",
                        "outline": "#8c909f",
                        "surface-bright": "#31394d",
                        "surface-container-high": "#222a3d",
                        "primary-fixed-dim": "#adc6ff",
                        "on-surface": "#dae2fd",
                        "tertiary": "#ffb786",
                        "tertiary-container": "#df7412",
                        "inverse-primary": "#005ac2",
                        "inverse-surface": "#dae2fd",
                        "on-tertiary-container": "#461f00",
                        "error-container": "#93000a",
                        "background": "#0b1326",
                        "on-error": "#690005",
                        "secondary-fixed": "#d3e4fe",
                        "inverse-on-surface": "#283044",
                        "primary": "#adc6ff",
                        "on-tertiary-fixed-variant": "#723600",
                        "surface-dim": "#0b1326",
                        "on-primary-fixed-variant": "#004395",
                        "surface-container-highest": "#2d3449",
                        "tertiary-fixed": "#ffdcc6",
                        "on-primary-fixed": "#001a42",
                        "on-secondary-container": "#a9bad3",
                        "on-secondary": "#213145"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "density-comfortable": "12px",
                        "margin-desktop": "24px",
                        "gutter": "16px",
                        "unit": "4px",
                        "density-compact": "4px",
                        "margin-mobile": "16px"
                    },
                    "fontFamily": {
                        "display-lg": ["Inter"],
                        "data-mono": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-sm": ["Inter"],
                        "label-caps": ["Inter"],
                        "body-sm": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                        "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                        "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-background text-on-background selection:bg-primary/30">
<!-- Sidebar Navigation Shell -->
<aside class="flex flex-col h-full fixed left-0 top-0 z-40 h-screen w-64 border-r border-outline-variant bg-surface">
<div class="px-6 py-8">
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary">SimaOS</h1>
<p class="font-body-sm text-body-sm text-on-surface-variant opacity-70">Precision Manufacturing</p>
</div>
<nav class="flex-1 overflow-y-auto custom-scrollbar">
<ul class="space-y-1">
<li>
<a class="flex items-center gap-3 text-primary font-bold border-l-4 border-primary bg-primary-container/10 px-4 py-3 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md text-body-md">Dashboard</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">factory</span>
<span class="font-body-md text-body-md">Live Batches</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">timeline</span>
<span class="font-body-md text-body-md">Traceability</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">verified_user</span>
<span class="font-body-md text-body-md">Quality Control</span>
</a>
</li>
<li>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">settings_suggest</span>
<span class="font-body-md text-body-md">Maintenance</span>
</a>
</li>
</ul>
<!-- Manufacturing Copilot Interface -->
<div class="mt-8 px-4">
<div class="bg-surface-container-high rounded-xl p-4 border border-outline-variant/30">
<div class="flex items-center gap-2 mb-3">
<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<span class="font-label-caps text-label-caps text-primary">MANUFACTURING COPILOT</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant mb-4">"Batch 402 shows a 12% drift in viscosity. Should I adjust flow rate?"</p>
<button class="w-full bg-primary text-on-primary font-body-sm text-body-sm py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all">Ask Copilot</button>
</div>
</div>
</nav>
<div class="p-4 border-t border-outline-variant">
<button class="w-full text-left flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 rounded-lg mb-2">
<span class="material-symbols-outlined">help</span>
<span class="font-body-md text-body-md">Support</span>
</button>
<button class="w-full text-left flex items-center gap-3 text-error px-4 py-3 hover:bg-error-container/10 transition-colors duration-200 rounded-lg">
<span class="material-symbols-outlined">logout</span>
<span class="font-body-md text-body-md">Log Out</span>
</button>
</div>
</aside>
<!-- Top App Bar -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 ml-64 bg-surface border-b border-outline-variant">
<div class="flex items-center gap-6 flex-1">
<span class="font-headline-sm text-headline-sm font-extrabold text-on-surface">SimaOS Manufacturing</span>
<div class="relative w-96">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input class="w-full bg-surface-container border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm focus:outline-none focus:border-primary transition-colors" placeholder="Search batches, lots, or alerts..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center bg-secondary-container/30 px-3 py-1.5 rounded-full border border-outline-variant">
<span class="font-label-caps text-label-caps text-secondary mr-2">ROLE:</span>
<span class="font-body-sm text-body-sm text-on-secondary-container">Manager</span>
</div>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">hub</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">account_circle</button>
</div>
</header>
<!-- Main Content Area -->
<main class="ml-64 p-margin-desktop">
<!-- KPI Section: Bento Grid Header -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
<!-- Total Lots -->
<div class="bg-surface-container-low border border-outline-variant p-5 group hover:border-primary transition-colors relative overflow-hidden">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-primary">inventory_2</span>
<span class="font-data-mono text-data-mono text-primary bg-primary/10 px-2 rounded">+12.5%</span>
</div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">TOTAL LOTS</p>
<p class="font-display-lg text-display-lg text-on-surface">1,402</p>
<div class="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
<div class="h-full bg-primary w-2/3"></div>
</div>
</div>
<!-- Pending QC -->
<div class="bg-surface-container-low border border-outline-variant p-5 group hover:border-tertiary transition-colors">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-tertiary">pending_actions</span>
<span class="font-data-mono text-data-mono text-tertiary">URGENT</span>
</div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">PENDING QC</p>
<p class="font-display-lg text-display-lg text-on-surface">24</p>
<p class="text-on-tertiary-fixed-variant text-[10px] mt-2 font-body-sm italic">Avg wait: 42 mins</p>
</div>
<!-- Approved Today -->
<div class="bg-surface-container-low border border-outline-variant p-5 group hover:border-on-primary-container transition-colors">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-primary-container">check_circle</span>
<span class="font-data-mono text-data-mono text-on-primary-container">98.2% RATE</span>
</div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">APPROVED TODAY</p>
<p class="font-display-lg text-display-lg text-on-surface">312</p>
</div>
<!-- Rejected Today -->
<div class="bg-surface-container-low border border-outline-variant p-5 group hover:border-error transition-colors">
<div class="flex justify-between items-start mb-4">
<span class="material-symbols-outlined text-error">dangerous</span>
<span class="font-data-mono text-data-mono text-error">CRITICAL (3)</span>
</div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">REJECTED TODAY</p>
<p class="font-display-lg text-display-lg text-on-surface">06</p>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<!-- Main Section: Supplier Quality Trends -->
<div class="lg:col-span-2 flex flex-col gap-gutter">
<div class="bg-surface-container p-6 border border-outline-variant h-full">
<div class="flex justify-between items-center mb-8">
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface">Supplier Quality Trends</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Analytical performance across primary logistics partners</p>
</div>
<div class="flex gap-2">
<button class="bg-surface-container-high border border-outline-variant px-3 py-1.5 rounded text-body-sm hover:bg-surface-variant transition-colors">Weekly</button>
<button class="bg-primary text-on-primary px-3 py-1.5 rounded text-body-sm font-semibold">Monthly</button>
</div>
</div>
<!-- Chart Simulation Area -->
<div class="relative h-64 w-full flex items-end gap-2 border-b border-l border-outline-variant/30 pb-2 pl-2">
<div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
<div class="border-t border-on-surface w-full"></div>
<div class="border-t border-on-surface w-full"></div>
<div class="border-t border-on-surface w-full"></div>
</div>
<!-- Bar Charts -->
<div class="flex-1 bg-primary/40 group relative h-[85%] hover:bg-primary transition-all rounded-t-sm" title="Supplier A">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono">94%</div>
</div>
<div class="flex-1 bg-primary/20 group relative h-[60%] hover:bg-primary transition-all rounded-t-sm" title="Supplier B">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono">72%</div>
</div>
<div class="flex-1 bg-primary/40 group relative h-[92%] hover:bg-primary transition-all rounded-t-sm" title="Supplier C">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono">98%</div>
</div>
<div class="flex-1 bg-error/40 group relative h-[45%] hover:bg-error transition-all rounded-t-sm" title="Supplier D">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono text-error">42%</div>
</div>
<div class="flex-1 bg-primary/40 group relative h-[78%] hover:bg-primary transition-all rounded-t-sm" title="Supplier E">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono">85%</div>
</div>
<div class="flex-1 bg-primary/40 group relative h-[82%] hover:bg-primary transition-all rounded-t-sm" title="Supplier F">
<div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-data-mono text-data-mono">88%</div>
</div>
</div>
<div class="flex justify-between mt-4 font-label-caps text-label-caps text-on-surface-variant">
<span>SUPPLIER A</span>
<span>SUPPLIER B</span>
<span>SUPPLIER C</span>
<span>SUPPLIER D</span>
<span>SUPPLIER E</span>
<span>SUPPLIER F</span>
</div>
<!-- AI Insights Mini-Card -->
<div class="mt-8 bg-surface-container-high p-4 border-l-4 border-primary-container flex items-start gap-4">
<span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
<div>
<p class="font-headline-sm text-body-md font-bold text-on-surface">Optimization Opportunity Identified</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">Switching Supplier D's current component intake to Supplier C could reduce batch variance by 14.2% based on current historical genealogy.</p>
</div>
</div>
</div>
</div>
<!-- Operational Alerts Sidebar -->
<div class="flex flex-col gap-gutter">
<div class="bg-surface-container-highest p-6 border border-outline-variant h-full flex flex-col">
<div class="flex justify-between items-center mb-6">
<h2 class="font-headline-sm text-headline-sm text-on-surface">Operational Alerts</h2>
<span class="bg-error text-on-error font-label-caps text-[10px] px-2 py-0.5 rounded-full">ACTIVE</span>
</div>
<div class="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
<!-- Alert 1 -->
<div class="bg-surface-container border-l-4 border-error p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
<div class="flex justify-between mb-1">
<span class="font-label-caps text-label-caps text-error">CRITICAL RISK</span>
<span class="font-data-mono text-data-mono text-on-surface-variant">2m ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-semibold mb-1">High Rejection Risk for Supplier A</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">Traceability model detected variance trend in lot #A-102. Action required.</p>
</div>
<!-- Alert 2 -->
<div class="bg-surface-container border-l-4 border-tertiary p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
<div class="flex justify-between mb-1">
<span class="font-label-caps text-label-caps text-tertiary">MAINTENANCE</span>
<span class="font-data-mono text-data-mono text-on-surface-variant">14m ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-semibold mb-1">Pump System 04 Calibration Needed</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">AI predicts failure within 72 hours if not recalibrated. Scheduled for 18:00.</p>
</div>
<!-- Alert 3 -->
<div class="bg-surface-container border-l-4 border-primary-container p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
<div class="flex justify-between mb-1">
<span class="font-label-caps text-label-caps text-primary-container">OPTIMIZATION</span>
<span class="font-data-mono text-data-mono text-on-surface-variant">1h ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface font-semibold mb-1">Energy Peak Demand Forecast</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">Suggest delaying Batch #902 by 2 hours to avoid peak tariff window.</p>
</div>
</div>
<button class="w-full mt-6 py-3 border border-outline text-on-surface-variant font-label-caps text-label-caps hover:border-primary hover:text-primary transition-all">VIEW ALERT ARCHIVE</button>
</div>
</div>
</div>
<!-- Secondary Operational Monitoring -->
<div class="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="md:col-span-1 bg-surface border border-outline-variant overflow-hidden">
<div class="p-4 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold">Facility Map Overview</span>
<span class="material-symbols-outlined text-sm">map</span>
</div>
<div class="aspect-video bg-surface-container-lowest relative">
<img class="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" data-alt="A high-tech, futuristic aerial architectural blueprint of a smart factory floor rendered in a dark blue and neon slate color scheme. The layout features glowing pathways, modular production units, and digital data overlays pulsing with industrial intelligence. The lighting is low-key with sharp cyan and white accents highlighting the precise manufacturing grid." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTc6iW7mdOE2tKInz2_6DZy3PtKIU12-5VkzwaE1ur1vIYtiQLwu5BzJ_R_HepWb30XIMEsFLnJkBzsTTto1Em9dua6V2Q7mgbNQVLz6A495ThOVNJEfG9Pfftf-jTTl83IspRxEQrTL4RaUSMFO36Vslz4AQZB9-G0bogGTJ0bynFsBIX6GuiVoczdDTXJpUgk8B30EVpFBgabjSVOLfVzbX21dupNWJA1cWbxSJa9O1NTdiMFV2WivwQRFROhYcdIBYTT79TpOPg"/>
<div class="absolute top-4 left-4 flex gap-2">
<div class="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse"></div>
<div class="w-3 h-3 rounded-full bg-error ring-4 ring-error/20"></div>
</div>
</div>
</div>
<div class="md:col-span-2 bg-surface border border-outline-variant">
<div class="p-4 bg-surface-container-high border-b border-outline-variant flex items-center justify-between">
<span class="font-headline-sm text-body-md font-bold">Real-time Batch Genealogy Pipeline</span>
<button class="text-primary text-body-sm hover:underline">Full Traceability View</button>
</div>
<div class="p-6">
<div class="flex items-center gap-4 relative">
<div class="absolute left-6 top-0 bottom-0 w-px bg-outline-variant z-0"></div>
<div class="flex-1 space-y-6">
<div class="flex gap-4 relative z-10">
<div class="w-12 h-12 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center">
<span class="material-symbols-outlined text-primary">source</span>
</div>
<div>
<p class="font-body-md text-body-md font-bold">Raw Material Ingest (Lot #R-882)</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">Verified by AI Vision Cluster • 08:42 AM</p>
</div>
</div>
<div class="flex gap-4 relative z-10">
<div class="w-12 h-12 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center">
<span class="material-symbols-outlined text-primary">biotech</span>
</div>
<div>
<p class="font-body-md text-body-md font-bold">Synthesis Phase Beta</p>
<p class="font-body-sm text-body-sm text-on-surface-variant">Active • Chamber Temp: 142.4°C • Pressure: Stable</p>
</div>
</div>
<div class="flex gap-4 relative z-10">
<div class="w-12 h-12 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center opacity-50">
<span class="material-symbols-outlined">inventory</span>
</div>
<div>
<p class="font-body-md text-body-md font-bold">Packaging &amp; Labeling</p>
<p class="font-body-sm text-body-sm text-on-surface-variant italic">Scheduled for 14:00 PM</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<script>
        // Micro-interactions and subtle effects
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Subtle feedback if needed
            });
        });

        // Simulating some live updates
        setInterval(() => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const timeElements = document.querySelectorAll('.font-data-mono');
            if (timeElements.length > 0) {
                // Future implementation: dynamic data updates
            }
        }, 60000);
    </script>

</body></html>

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SimaOS | Digital Batch Passport</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0b1326;
            color: #dae2fd;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .ai-glow {
            box-shadow: inset 0 0 12px rgba(173, 198, 255, 0.1), 0 0 8px rgba(173, 198, 255, 0.05);
            border: 1px solid rgba(173, 198, 255, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #171f33;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #424754;
            border-radius: 2px;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "secondary": "#b7c8e1",
                      "error": "#ffb4ab",
                      "primary-container": "#4d8eff",
                      "surface-tint": "#adc6ff",
                      "surface-container-lowest": "#060e20",
                      "on-secondary-fixed": "#0b1c30",
                      "surface-container": "#171f33",
                      "tertiary-fixed-dim": "#ffb786",
                      "on-tertiary": "#502400",
                      "secondary-fixed-dim": "#b7c8e1",
                      "on-surface-variant": "#c2c6d6",
                      "on-secondary-fixed-variant": "#38485d",
                      "on-primary-container": "#00285d",
                      "outline-variant": "#424754",
                      "surface": "#0b1326",
                      "surface-variant": "#2d3449",
                      "secondary-container": "#3a4a5f",
                      "on-error-container": "#ffdad6",
                      "on-background": "#dae2fd",
                      "on-tertiary-fixed": "#311400",
                      "primary-fixed": "#d8e2ff",
                      "on-primary": "#002e6a",
                      "surface-container-low": "#131b2e",
                      "outline": "#8c909f",
                      "surface-bright": "#31394d",
                      "surface-container-high": "#222a3d",
                      "primary-fixed-dim": "#adc6ff",
                      "on-surface": "#dae2fd",
                      "tertiary": "#ffb786",
                      "tertiary-container": "#df7412",
                      "inverse-primary": "#005ac2",
                      "inverse-surface": "#dae2fd",
                      "on-tertiary-container": "#461f00",
                      "error-container": "#93000a",
                      "background": "#0b1326",
                      "on-error": "#690005",
                      "secondary-fixed": "#d3e4fe",
                      "inverse-on-surface": "#283044",
                      "primary": "#adc6ff",
                      "on-tertiary-fixed-variant": "#723600",
                      "surface-dim": "#0b1326",
                      "on-primary-fixed-variant": "#004395",
                      "surface-container-highest": "#2d3449",
                      "tertiary-fixed": "#ffdcc6",
                      "on-primary-fixed": "#001a42",
                      "on-secondary-container": "#a9bad3",
                      "on-secondary": "#213145"
              },
              "borderRadius": {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
              },
              "spacing": {
                      "density-comfortable": "12px",
                      "margin-desktop": "24px",
                      "gutter": "16px",
                      "unit": "4px",
                      "density-compact": "4px",
                      "margin-mobile": "16px"
              },
              "fontFamily": {
                      "display-lg": ["Inter"],
                      "data-mono": ["Inter"],
                      "body-md": ["Inter"],
                      "headline-sm": ["Inter"],
                      "label-caps": ["Inter"],
                      "body-sm": ["Inter"],
                      "headline-md": ["Inter"]
              },
              "fontSize": {
                      "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                      "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                      "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                      "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                      "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                      "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
              }
            },
          },
        }
    </script>
</head>
<body class="bg-background text-on-surface overflow-hidden">
<!-- SideNavBar -->
<aside class="flex flex-col h-full fixed left-0 top-0 z-40 h-screen w-64 border-r border-outline-variant bg-surface">
<div class="p-6">
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary">SimaOS</h1>
<p class="font-body-sm text-body-sm text-on-surface-variant">Precision Manufacturing</p>
</div>
<nav class="flex-1 px-2 space-y-1">
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md text-body-md">Dashboard</span>
</a>
<a class="flex items-center space-x-3 text-primary font-bold border-l-4 border-primary bg-primary-container/10 px-4 py-3 active:scale-[0.98] transition-transform" href="#">
<span class="material-symbols-outlined">factory</span>
<span class="font-body-md text-body-md">Live Batches</span>
</a>
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined">timeline</span>
<span class="font-body-md text-body-md">Traceability</span>
</a>
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined">verified_user</span>
<span class="font-body-md text-body-md">Quality Control</span>
</a>
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined">settings_suggest</span>
<span class="font-body-md text-body-md">Maintenance</span>
</a>
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-3 hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-body-md text-body-md">System Settings</span>
</a>
</nav>
<div class="mt-auto border-t border-outline-variant p-4 space-y-4">
<button class="w-full text-left px-4 py-2 text-on-surface-variant hover:bg-surface-variant/50 transition-colors rounded">
<span class="font-label-caps text-label-caps block text-primary mb-1">CURRENT SESSION</span>
<span class="font-body-sm text-body-sm">Switch Role: Manager</span>
</button>
<div class="space-y-1">
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-2 hover:text-on-surface transition-colors" href="#">
<span class="material-symbols-outlined">help</span>
<span class="font-body-sm text-body-sm">Support</span>
</a>
<a class="flex items-center space-x-3 text-on-surface-variant px-4 py-2 hover:text-on-surface transition-colors" href="#">
<span class="material-symbols-outlined">logout</span>
<span class="font-body-sm text-body-sm">Log Out</span>
</a>
</div>
</div>
</aside>
<!-- Main Content Area -->
<div class="ml-64 flex flex-col min-h-screen">
<!-- TopAppBar -->
<header class="flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 border-b border-outline-variant bg-surface">
<div class="flex items-center space-x-4">
<span class="font-headline-sm text-headline-sm font-extrabold text-on-surface">SimaOS Manufacturing</span>
<div class="h-4 w-px bg-outline-variant"></div>
<div class="flex items-center bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant">
<span class="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">search</span>
<input class="bg-transparent border-none focus:ring-0 text-body-sm p-0 w-64 placeholder-on-surface-variant" placeholder="Search batch, lot or material..." type="text"/>
</div>
</div>
<div class="flex items-center space-x-6">
<div class="flex space-x-4">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">hub</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">account_circle</button>
</div>
</div>
</header>
<!-- Canvas -->
<main class="flex-1 p-margin-desktop overflow-y-auto custom-scrollbar">
<!-- Header Actions Section -->
<div class="flex justify-between items-end mb-8">
<div>
<div class="flex items-center space-x-3 mb-1">
<span class="font-label-caps text-label-caps text-primary tracking-widest">DIGITAL BATCH PASSPORT</span>
<div class="bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold border border-tertiary/30">PENDING DECISION</div>
</div>
<h2 class="font-display-lg text-display-lg">LOT-2026-002</h2>
<p class="font-body-md text-on-surface-variant flex items-center">
<span class="material-symbols-outlined text-[18px] mr-1">eco</span>
                        Ginger Root (Zingiber officinale) • Incoming Inspection
                    </p>
</div>
<div class="flex space-x-3">
<button class="px-6 py-2 border border-error text-error font-semibold text-body-sm hover:bg-error/10 transition-colors active:scale-95">
                        REJECT BATCH
                    </button>
<button class="px-6 py-2 bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-fixed transition-colors active:scale-95 shadow-lg shadow-primary/20">
                        APPROVE BATCH
                    </button>
</div>
</div>
<div class="grid grid-cols-12 gap-gutter">
<!-- Left Column: Lot Info & AI Metrics -->
<div class="col-span-12 lg:col-span-8 space-y-gutter">
<!-- Lot Info Card -->
<div class="bg-surface-container border border-outline-variant p-6 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
<h3 class="font-label-caps text-label-caps text-on-surface-variant mb-4">LOT SPECIFICATIONS</h3>
<div class="grid grid-cols-3 gap-6">
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">Supplier</p>
<p class="font-data-mono text-data-mono">TerraLogistics Global</p>
</div>
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">Weight</p>
<p class="font-data-mono text-data-mono">450.00 kg</p>
</div>
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">Receipt Date</p>
<p class="font-data-mono text-data-mono">Oct 24, 2023 08:42 AM</p>
</div>
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">Warehouse Zone</p>
<p class="font-data-mono text-data-mono">Cold Storage - A4</p>
</div>
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">Target QC Score</p>
<p class="font-data-mono text-data-mono">75/100</p>
</div>
<div>
<p class="text-on-surface-variant text-[11px] uppercase tracking-tighter mb-1">RFID Tag</p>
<p class="font-data-mono text-data-mono">#RFID-G-2026-X8</p>
</div>
</div>
</div>
<!-- AI QC Assessment Bento Grid -->
<div class="grid grid-cols-2 gap-gutter">
<!-- Score Card -->
<div class="bg-surface-container border border-outline-variant p-6 flex items-center space-x-6 ai-glow">
<div class="relative w-24 h-24 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-outline-variant" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="45.2" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-2xl font-bold">82</span>
<span class="text-[10px] text-on-surface-variant">/ 100</span>
</div>
</div>
<div>
<h4 class="font-headline-sm text-headline-sm mb-1">AI QC Score</h4>
<p class="text-body-sm text-on-surface-variant leading-tight">Batch quality exceeds minimum threshold by <span class="text-primary font-bold">+7.0%</span>.</p>
</div>
</div>
<!-- Assessment Details -->
<div class="bg-surface-container border border-outline-variant p-6 ai-glow">
<h3 class="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center">
<span class="material-symbols-outlined text-[16px] mr-2" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                                INTELLIGENCE ASSESSMENT
                            </h3>
<div class="space-y-4">
<div class="flex items-center justify-between">
<span class="text-body-sm text-on-surface-variant">Color Profile</span>
<span class="bg-surface-variant text-on-surface px-2 py-0.5 text-xs font-medium border border-outline-variant">Standard</span>
</div>
<div class="flex items-start justify-between">
<span class="text-body-sm text-on-surface-variant">Detected Anomalies</span>
<div class="text-right">
<span class="text-xs text-secondary font-bold block">Minor surface moisture</span>
<span class="text-[10px] text-on-surface-variant">Confidence: 94.2%</span>
</div>
</div>
</div>
</div>
</div>
<!-- Visual Analysis -->
<div class="bg-surface-container border border-outline-variant overflow-hidden group">
<div class="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
<h3 class="font-label-caps text-label-caps">AI COMPUTER VISION OVERLAY</h3>
<div class="flex space-x-2">
<button class="p-1 hover:bg-surface-variant rounded transition-colors"><span class="material-symbols-outlined text-[18px]">zoom_in</span></button>
<button class="p-1 hover:bg-surface-variant rounded transition-colors"><span class="material-symbols-outlined text-[18px]">layers</span></button>
</div>
</div>
<div class="aspect-video relative bg-surface-container-lowest">
<img alt="Visual inspection image of raw ginger roots" class="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" data-alt="A macro high-resolution photography of fresh ginger roots spread across a clean industrial stainless steel surface. The lighting is clinical and bright, highlighting the fibrous texture and sandy skin of the ginger. Blue digital analytical overlays highlight specific points of interest on the roots with geometric wireframes and data points, representing an AI vision system processing the quality in a high-tech manufacturing environment. Dark enterprise slate aesthetic with glowing primary blue accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9p59g4x9wWTNj1jLyh-XoptNpuse1Stfn2dBsPUe_dlAObaRFRnDMfACVuIka6YHFEaxkXxlTRI-SxCiABtFT5WdTK-yxJIgoCWeak-WUx50L5_p-YbpNoWhe99PnYtfA8EIj5umJANZWJORUK4E-_rmRyRvh7iCEfOa8cscB_7I_XEl7CpqbMiVIMffBxNAan6pbTVaAUCztOZ--ZCuhPKDZq3fKnZzdxdMUNaWv9Kp5J5qbIoVMnAq4l6BrmQFCfGErcVWkdA2B"/>
<!-- Mock AI Overlays -->
<div class="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-primary border-dashed rounded-full flex items-center justify-center animate-pulse">
<div class="bg-primary/20 backdrop-blur-sm p-1 border border-primary/50 text-[10px] font-bold text-primary">MOISTURE DETECTED</div>
</div>
<div class="absolute bottom-1/3 right-1/4 w-24 h-24 border border-secondary border-dashed flex items-start justify-start p-1">
<div class="text-[10px] text-secondary font-bold">COLOR: PASS</div>
</div>
</div>
</div>
</div>
<!-- Right Column: Timeline -->
<div class="col-span-12 lg:col-span-4 h-full">
<div class="bg-surface-container border border-outline-variant p-6 h-full flex flex-col">
<h3 class="font-label-caps text-label-caps text-on-surface-variant mb-8 tracking-widest">GENEALOGY &amp; EVENTS</h3>
<div class="flex-1 relative pl-8 border-l border-outline-variant ml-2 space-y-12">
<!-- Event 1 -->
<div class="relative">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface ring-4 ring-primary/10"></div>
<div>
<p class="font-label-caps text-label-caps text-primary mb-1">OCT 24, 08:42</p>
<h4 class="font-headline-sm text-body-md font-bold mb-1">Lot Created</h4>
<p class="text-body-sm text-on-surface-variant">Batch entry registered by Warehouse Inbound System. Origin: Southeast Farm Hub.</p>
</div>
</div>
<!-- Event 2 -->
<div class="relative">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface ring-4 ring-primary/10"></div>
<div>
<p class="font-label-caps text-label-caps text-primary mb-1">OCT 24, 09:15</p>
<h4 class="font-headline-sm text-body-md font-bold mb-1">Image Uploaded</h4>
<p class="text-body-sm text-on-surface-variant">Station 04 high-resolution optical captures synchronized for analysis.</p>
</div>
</div>
<!-- Event 3 -->
<div class="relative">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface ring-4 ring-primary/10"></div>
<div>
<p class="font-label-caps text-label-caps text-primary mb-1">OCT 24, 09:16</p>
<h4 class="font-headline-sm text-body-md font-bold mb-1">AI Graded</h4>
<p class="text-body-sm text-on-surface-variant">Vision Model v4.2 processed lot. Quality Score 82 generated. 1 alert raised.</p>
<div class="mt-2 bg-surface-variant/30 p-2 border border-outline-variant">
<div class="flex items-center text-[10px] text-secondary font-bold">
<span class="material-symbols-outlined text-[14px] mr-1">warning</span>
                                            SURFACE MOISTURE DETECTED
                                        </div>
</div>
</div>
</div>
<!-- Event 4 -->
<div class="relative">
<div class="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-tertiary border-4 border-surface ring-4 ring-tertiary/20"></div>
<div class="opacity-100">
<p class="font-label-caps text-label-caps text-tertiary mb-1">CURRENT STATUS</p>
<h4 class="font-headline-sm text-body-md font-bold mb-1">Pending Human Decision</h4>
<p class="text-body-sm text-on-surface-variant italic">Waiting for floor supervisor manual validation of moisture alert.</p>
</div>
</div>
</div>
<!-- Footer Traceability -->
<div class="mt-12 pt-6 border-t border-outline-variant">
<div class="flex items-center justify-between mb-4">
<span class="text-[11px] text-on-surface-variant font-bold uppercase">Chain of Custody</span>
<span class="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
<div class="flex -space-x-2">
<div class="w-8 h-8 rounded-full border border-surface bg-surface-variant flex items-center justify-center text-[10px] font-bold">JS</div>
<div class="w-8 h-8 rounded-full border border-surface bg-primary-container flex items-center justify-center text-[10px] font-bold">AI</div>
<div class="w-8 h-8 rounded-full border border-surface bg-secondary-container flex items-center justify-center text-[10px] font-bold">TR</div>
</div>
<p class="text-[10px] text-on-surface-variant mt-3">Immutable ledger record: <span class="font-data-mono">0x4f2...9a12</span></p>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Micro-interaction Scripts -->
<script>
        // Simple hover effect for "approve/reject" buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                // Potential for sound or additional visual feedback
            });
        });

        // Simulating AI scan lines on the image
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'absolute top-0 left-0 w-full h-1 bg-primary/30 blur-[2px] pointer-events-none z-10';
        overlayDiv.style.animation = 'scan 4s linear infinite';
        document.querySelector('.aspect-video').appendChild(overlayDiv);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
            }
        `;
        document.head.appendChild(style);
    </script>

</body></html>

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SimaOS | New Batch Intake</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0b1326; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 2px; }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .shimmer-bg {
            position: relative;
            overflow: hidden;
        }
        .shimmer-bg::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, transparent, rgba(77, 142, 255, 0.1), transparent);
            animation: shimmer 2s infinite;
        }
    </style>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary": "#b7c8e1",
                    "error": "#ffb4ab",
                    "primary-container": "#4d8eff",
                    "surface-tint": "#adc6ff",
                    "surface-container-lowest": "#060e20",
                    "on-secondary-fixed": "#0b1c30",
                    "surface-container": "#171f33",
                    "tertiary-fixed-dim": "#ffb786",
                    "on-tertiary": "#502400",
                    "secondary-fixed-dim": "#b7c8e1",
                    "on-surface-variant": "#c2c6d6",
                    "on-secondary-fixed-variant": "#38485d",
                    "on-primary-container": "#00285d",
                    "outline-variant": "#424754",
                    "surface": "#0b1326",
                    "surface-variant": "#2d3449",
                    "secondary-container": "#3a4a5f",
                    "on-error-container": "#ffdad6",
                    "on-background": "#dae2fd",
                    "on-tertiary-fixed": "#311400",
                    "primary-fixed": "#d8e2ff",
                    "on-primary": "#002e6a",
                    "surface-container-low": "#131b2e",
                    "outline": "#8c909f",
                    "surface-bright": "#31394d",
                    "surface-container-high": "#222a3d",
                    "primary-fixed-dim": "#adc6ff",
                    "on-surface": "#dae2fd",
                    "tertiary": "#ffb786",
                    "tertiary-container": "#df7412",
                    "inverse-primary": "#005ac2",
                    "inverse-surface": "#dae2fd",
                    "on-tertiary-container": "#461f00",
                    "error-container": "#93000a",
                    "background": "#0b1326",
                    "on-error": "#690005",
                    "secondary-fixed": "#d3e4fe",
                    "inverse-on-surface": "#283044",
                    "primary": "#adc6ff",
                    "on-tertiary-fixed-variant": "#723600",
                    "surface-dim": "#0b1326",
                    "on-primary-fixed-variant": "#004395",
                    "surface-container-highest": "#2d3449",
                    "tertiary-fixed": "#ffdcc6",
                    "on-primary-fixed": "#001a42",
                    "on-secondary-container": "#a9bad3",
                    "on-secondary": "#213145"
            },
            "borderRadius": {
                    "DEFAULT": "0.125rem",
                    "lg": "0.25rem",
                    "xl": "0.5rem",
                    "full": "0.75rem"
            },
            "spacing": {
                    "density-comfortable": "12px",
                    "margin-desktop": "24px",
                    "gutter": "16px",
                    "unit": "4px",
                    "density-compact": "4px",
                    "margin-mobile": "16px"
            },
            "fontFamily": {
                    "display-lg": ["Inter"],
                    "data-mono": ["Inter"],
                    "body-md": ["Inter"],
                    "headline-sm": ["Inter"],
                    "label-caps": ["Inter"],
                    "body-sm": ["Inter"],
                    "headline-md": ["Inter"]
            },
            "fontSize": {
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "data-mono": ["13px", {"lineHeight": "18px", "fontWeight": "500"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "headline-sm": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                    "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                    "body-sm": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          },
        },
      }
    </script>
</head>
<body class="bg-background text-on-surface font-body-md overflow-hidden">
<!-- SideNavBar Anchor -->
<aside class="flex flex-col h-full fixed left-0 top-0 z-40 h-screen w-64 border-r border-outline-variant bg-surface">
<div class="px-6 py-8">
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary">SimaOS</h1>
<p class="text-on-surface-variant font-label-caps text-label-caps uppercase tracking-widest mt-1">Precision Manufacturing</p>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface transition-colors duration-200" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md">Dashboard</span>
</a>
<a class="flex items-center gap-3 text-primary font-bold border-l-4 border-primary bg-primary-container/10 px-4 py-3 transition-colors duration-200" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">factory</span>
<span class="font-body-md">Live Batches</span>
</a>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface transition-colors duration-200" href="#">
<span class="material-symbols-outlined">timeline</span>
<span class="font-body-md">Traceability</span>
</a>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface transition-colors duration-200" href="#">
<span class="material-symbols-outlined">verified_user</span>
<span class="font-body-md">Quality Control</span>
</a>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface transition-colors duration-200" href="#">
<span class="material-symbols-outlined">settings_suggest</span>
<span class="font-body-md">Maintenance</span>
</a>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-on-surface transition-colors duration-200" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-body-md">System Settings</span>
</a>
</nav>
<div class="p-4 border-t border-outline-variant">
<button class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors text-body-sm font-body-sm">
<span class="material-symbols-outlined text-[18px]">cached</span>
                Switch Role: Manager
            </button>
<div class="mt-4 space-y-1">
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:text-on-surface text-body-sm transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">help</span>
                    Support
                </a>
<a class="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:text-on-surface text-body-sm transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">logout</span>
                    Log Out
                </a>
</div>
</div>
</aside>
<!-- TopAppBar Anchor -->
<header class="flex justify-between items-center w-[calc(100%-16rem)] px-margin-desktop h-16 sticky top-0 z-50 ml-64 border-b border-outline-variant bg-surface">
<div class="flex items-center gap-6">
<h2 class="font-headline-sm text-headline-sm font-extrabold text-on-surface">SimaOS Manufacturing</h2>
<div class="relative hidden lg:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
<input class="bg-surface-container-low border border-outline-variant rounded px-10 py-1.5 text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64" placeholder="Search batch ID, material..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
<span class="material-symbols-outlined">hub</span>
</button>
<div class="h-8 w-8 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center cursor-pointer overflow-hidden">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="A professional close-up of a manufacturing floor supervisor wearing a dark navy utility vest and a headset. The background is a blurred high-tech industrial facility with blue and white LED indicators. The lighting is cinematic and sharp, emphasizing a modern industrial corporate aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEgov1W5xrSsg0dvmLCvMii5QrFDv1U5U-vKj_-yOJL3QKVfEM3CN6KvYbpk6CxoCqUDKSaMNLeEC2qCvjGF7txa4sIpOoAXheAmS_KGPkEOLEH4GCeV_LmFxtTOXtn7XHtqnYcNto0LGhwJT2ivti-NaAUK938TUySxakygJMCbUAbjm7sthtUO87XhAoHS7ol6X4_4NrgyK6oKpvIVi905xWGQM5yCF_kcTXzo5hzYqNRR8iAoJC_CaLBlZHXZuJKDivOPEmhCwp"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 p-margin-desktop overflow-y-auto h-[calc(100vh-64px)]">
<div class="max-w-5xl mx-auto">
<div class="mb-8">
<nav class="flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant mb-2">
<span class="hover:text-primary cursor-pointer">BATCHES</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="text-primary">CREATE NEW INTAKE</span>
</nav>
<h3 class="font-headline-md text-headline-md text-on-surface">New Batch Entry</h3>
<p class="text-on-surface-variant font-body-md">Precision intake logging for industrial traceability. Fill in the manufacturing parameters below.</p>
</div>
<div class="grid grid-cols-12 gap-gutter">
<!-- Left: Form Controls -->
<div class="col-span-12 lg:col-span-5 space-y-gutter">
<div class="bg-surface-container p-6 border border-outline-variant rounded shadow-sm">
<h4 class="font-headline-sm text-headline-sm mb-6 text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">list_alt</span>
                            Batch Parameters
                        </h4>
<form class="space-y-5" onsubmit="return false;">
<div class="space-y-2">
<label class="block text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Material Type</label>
<select class="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded p-3 text-body-md focus:border-primary focus:ring-0 outline-none appearance-none cursor-pointer">
<option>Select Grade...</option>
<option>High-Density Polyethylene (HDPE-80)</option>
<option>Surgical Grade Steel (316L)</option>
<option>Titanium Alloy (Grade 5)</option>
<option>Industrial Resin (X-Type)</option>
</select>
</div>
<div class="space-y-2">
<label class="block text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Supplier</label>
<select class="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded p-3 text-body-md focus:border-primary focus:ring-0 outline-none appearance-none cursor-pointer">
<option>Select Certified Supplier...</option>
<option>Global Industrial Raw Co.</option>
<option>Precision Metals Ltd.</option>
<option>Nexus Chemical Supplies</option>
<option>Synthetix Polymers</option>
</select>
</div>
<div class="space-y-2">
<label class="block text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Quantity (kg)</label>
<div class="relative">
<input class="w-full bg-surface-container-low border border-outline-variant text-on-surface rounded p-3 pr-12 text-body-md focus:border-primary focus:ring-0 outline-none [appearance:textfield] [&amp;::-webkit-outer-spin-button]:appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none font-data-mono" placeholder="0.00" type="number"/>
<span class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-caps">KG</span>
</div>
</div>
<button class="w-full bg-primary text-on-primary font-bold py-3 px-6 rounded hover:bg-primary-container transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2" type="submit">
<span class="material-symbols-outlined">save</span>
                                Initiate Batch Process
                            </button>
</form>
</div>
<div class="bg-surface-container p-6 border border-outline-variant rounded">
<div class="flex items-center gap-4">
<div class="p-3 bg-tertiary-container/20 rounded">
<span class="material-symbols-outlined text-tertiary">priority_high</span>
</div>
<div>
<h5 class="font-headline-sm text-headline-sm text-on-surface text-[16px]">Compliance Reminder</h5>
<p class="text-body-sm text-on-surface-variant">All material uploads require visual inspection photos for AI-assisted validation and audit trails.</p>
</div>
</div>
</div>
</div>
<!-- Right: Dropzone & Analysis -->
<div class="col-span-12 lg:col-span-7 space-y-gutter">
<div class="relative group bg-surface-container border-2 border-dashed border-outline-variant rounded-xl p-12 transition-all hover:border-primary cursor-pointer flex flex-col items-center justify-center min-h-[400px]" id="dropzone">
<div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
<div class="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6 border border-outline-variant group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-[40px] text-primary">add_a_photo</span>
</div>
<h4 class="font-headline-sm text-headline-sm text-on-surface mb-2">Upload Inspection Photo</h4>
<p class="text-on-surface-variant text-center max-w-sm mb-6">Drag and drop raw material photos here, or click to browse files. Supported: JPG, PNG, TIFF.</p>
<div class="flex gap-4">
<span class="px-3 py-1 bg-surface-container-highest rounded text-label-caps text-on-surface-variant">MIN 4K RESOLUTION</span>
<span class="px-3 py-1 bg-surface-container-highest rounded text-label-caps text-on-surface-variant">MACRO LENS RECOMMENDED</span>
</div>
<input accept="image/*" class="hidden" id="fileInput" onchange="startAnalysis()" type="file"/>
</div>
<!-- AI Analysis State (Initially Hidden) -->
<div class="hidden animate-in fade-in slide-in-from-bottom-4 duration-500" id="analysisSection">
<div class="bg-surface-container-high border border-primary/30 p-8 rounded-xl relative overflow-hidden">
<div class="shimmer-bg absolute inset-0 opacity-40"></div>
<div class="relative z-10 flex flex-col items-center text-center">
<div class="flex items-center justify-center gap-3 mb-6">
<div class="h-2 w-2 bg-primary rounded-full animate-ping"></div>
<span class="font-label-caps tracking-[0.2em] text-primary">NEURAL ENGINE ACTIVE</span>
</div>
<div class="w-full bg-surface-container-low h-1 rounded-full mb-8 overflow-hidden">
<div class="h-full bg-primary w-2/3 transition-all duration-[3000ms] ease-out" id="progressBar"></div>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">AI Analysis in Progress...</h3>
<div class="grid grid-cols-3 gap-8 w-full max-w-lg mt-4">
<div class="text-left">
<p class="text-label-caps text-on-surface-variant">PARTICLE SIZE</p>
<p class="font-data-mono text-primary text-[16px]">Scanning...</p>
</div>
<div class="text-left">
<p class="text-label-caps text-on-surface-variant">PURITY RATIO</p>
<p class="font-data-mono text-primary text-[16px]">Validating...</p>
</div>
<div class="text-left">
<p class="text-label-caps text-on-surface-variant">ANOMALIES</p>
<p class="font-data-mono text-primary text-[16px]">Searching...</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<script>
        document.getElementById('dropzone').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        function startAnalysis() {
            const dropzone = document.getElementById('dropzone');
            const analysis = document.getElementById('analysisSection');
            const progressBar = document.getElementById('progressBar');

            dropzone.classList.add('opacity-50', 'pointer-events-none');
            analysis.classList.remove('hidden');

            // Simulate progress animation
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);

            // In a real app, we'd handle the file upload and AI callback here
        }

        // Dropzone drag-and-drop effects
        const dz = document.getElementById('dropzone');
        ['dragenter', 'dragover'].forEach(eventName => {
            dz.addEventListener(eventName, (e) => {
                e.preventDefault();
                dz.classList.add('border-primary', 'bg-primary/10');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dz.addEventListener(eventName, (e) => {
                e.preventDefault();
                dz.classList.remove('border-primary', 'bg-primary/10');
                if (eventName === 'drop') startAnalysis();
            }, false);
        });
    </script>

</body></html>
