import { useMemo, useState } from 'react'
import './App.css'

type Option = {
  id: string
  label: string
  materialAdd: number
  laborHoursAdd: number
}

type Project = {
  id: string
  name: string
  unitName: string
  summary: string
  baseMaterialCost: number
  baseLaborHours: number
  basePermitFee: number
  contingencyPct: number
  frameOptions: Option[]
  performanceOptions: Option[]
  extras: Option[]
  suggestions: string[]
}

type LocationProfile = {
  id: string
  label: string
  materialIndex: number
  laborRate: number
  permitIndex: number
  materialTax: number
  notes: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const qualityTiers = {
  economy: { label: 'Economy', materialMultiplier: 0.88, laborMultiplier: 0.95 },
  standard: { label: 'Standard', materialMultiplier: 1, laborMultiplier: 1 },
  premium: { label: 'Premium', materialMultiplier: 1.2, laborMultiplier: 1.15 },
}

const projects: Project[] = [
  {
    id: 'sliding-door',
    name: 'Sliding patio door replacement',
    unitName: 'door',
    summary:
      'Replace an existing exterior sliding door with upgraded glass and frame options.',
    baseMaterialCost: 1650,
    baseLaborHours: 7.5,
    basePermitFee: 130,
    contingencyPct: 0.12,
    frameOptions: [
      { id: 'vinyl', label: 'Vinyl frame', materialAdd: 0, laborHoursAdd: 0 },
      {
        id: 'aluminum',
        label: 'Thermally broken aluminum frame',
        materialAdd: 280,
        laborHoursAdd: 0.5,
      },
      {
        id: 'fiberglass',
        label: 'Fiberglass frame',
        materialAdd: 420,
        laborHoursAdd: 0.75,
      },
    ],
    performanceOptions: [
      { id: 'clear', label: 'Dual-pane clear glass', materialAdd: 0, laborHoursAdd: 0 },
      {
        id: 'lowe',
        label: 'Low-E UV glass package',
        materialAdd: 210,
        laborHoursAdd: 0.2,
      },
      {
        id: 'impact',
        label: 'Impact-rated storm glass',
        materialAdd: 520,
        laborHoursAdd: 0.6,
      },
    ],
    extras: [
      {
        id: 'disposal',
        label: 'Old door haul-away and disposal',
        materialAdd: 135,
        laborHoursAdd: 0.8,
      },
      {
        id: 'smart-lock',
        label: 'Smart lock and sensor kit',
        materialAdd: 260,
        laborHoursAdd: 1.1,
      },
      {
        id: 'paint-trim',
        label: 'Trim repaint and caulking refresh',
        materialAdd: 180,
        laborHoursAdd: 2.25,
      },
    ],
    suggestions: [
      'Ask installers for an air-leakage test report before final payment.',
      'Check HOA requirements for glass tint and frame finish before ordering.',
      'Plan a 2-4 week lead time for non-stock frame colors.',
    ],
  },
  {
    id: 'window-bundle',
    name: 'Window replacement bundle',
    unitName: 'window',
    summary:
      'Swap multiple windows in one visit to reduce mobilization and labor overhead.',
    baseMaterialCost: 760,
    baseLaborHours: 3.25,
    basePermitFee: 110,
    contingencyPct: 0.1,
    frameOptions: [
      { id: 'vinyl', label: 'Vinyl frame', materialAdd: 0, laborHoursAdd: 0 },
      { id: 'wood-clad', label: 'Wood-clad frame', materialAdd: 300, laborHoursAdd: 0.9 },
      {
        id: 'fiberglass',
        label: 'Fiberglass frame',
        materialAdd: 220,
        laborHoursAdd: 0.4,
      },
    ],
    performanceOptions: [
      { id: 'clear', label: 'Double-pane clear', materialAdd: 0, laborHoursAdd: 0 },
      { id: 'triple', label: 'Triple-pane energy package', materialAdd: 280, laborHoursAdd: 0.2 },
      { id: 'impact', label: 'Impact-resistant pane', materialAdd: 360, laborHoursAdd: 0.4 },
    ],
    extras: [
      { id: 'blinds', label: 'Inside-mount blinds package', materialAdd: 175, laborHoursAdd: 0.35 },
      { id: 'trim', label: 'Interior trim replacement', materialAdd: 190, laborHoursAdd: 1 },
      { id: 'screens', label: 'Premium insect screens', materialAdd: 95, laborHoursAdd: 0.2 },
    ],
    suggestions: [
      'Replacing at least 5 windows often unlocks material discounts.',
      'Request U-factor and SHGC labels to compare energy rebates.',
      'Group street-facing windows in one style for curb appeal consistency.',
    ],
  },
  {
    id: 'bath-remodel',
    name: 'Bathroom tile remodel',
    unitName: 'bathroom',
    summary:
      'Full bathroom surface update including tile, waterproofing, and fixture finishes.',
    baseMaterialCost: 5400,
    baseLaborHours: 52,
    basePermitFee: 220,
    contingencyPct: 0.15,
    frameOptions: [
      { id: 'porcelain', label: 'Porcelain tile package', materialAdd: 0, laborHoursAdd: 0 },
      { id: 'natural-stone', label: 'Natural stone package', materialAdd: 1400, laborHoursAdd: 8 },
      { id: 'large-format', label: 'Large-format tile package', materialAdd: 780, laborHoursAdd: 4 },
    ],
    performanceOptions: [
      { id: 'standard', label: 'Standard waterproof membrane', materialAdd: 0, laborHoursAdd: 0 },
      {
        id: 'premium',
        label: 'Premium anti-fracture membrane',
        materialAdd: 540,
        laborHoursAdd: 2.5,
      },
      {
        id: 'heated-floor',
        label: 'Heated floor system',
        materialAdd: 850,
        laborHoursAdd: 5.5,
      },
    ],
    extras: [
      { id: 'glass-door', label: 'Frameless shower door', materialAdd: 1200, laborHoursAdd: 5 },
      { id: 'vanity', label: 'Custom vanity install', materialAdd: 1800, laborHoursAdd: 8 },
      { id: 'fixture-upgrade', label: 'Premium fixture kit', materialAdd: 900, laborHoursAdd: 3.5 },
    ],
    suggestions: [
      'Ask for separate waterproofing and tile labor line items in bids.',
      'Confirm if plumbing fixture relocation is included before signing.',
      'Order tile 8-12% overage to cover cuts and breakage.',
    ],
  },
]

const locationProfiles: LocationProfile[] = [
  {
    id: 'seattle-wa',
    label: 'Seattle, WA',
    materialIndex: 1.14,
    laborRate: 102,
    permitIndex: 1.2,
    materialTax: 0.1025,
    notes: 'Higher labor rates, strong demand for weather-resistant products.',
  },
  {
    id: 'austin-tx',
    label: 'Austin, TX',
    materialIndex: 1.02,
    laborRate: 82,
    permitIndex: 1,
    materialTax: 0.0825,
    notes: 'Balanced labor market with broad product availability.',
  },
  {
    id: 'charlotte-nc',
    label: 'Charlotte, NC',
    materialIndex: 0.96,
    laborRate: 74,
    permitIndex: 0.94,
    materialTax: 0.0725,
    notes: 'Moderate labor rates and competitive supplier pricing.',
  },
  {
    id: 'phoenix-az',
    label: 'Phoenix, AZ',
    materialIndex: 0.99,
    laborRate: 79,
    permitIndex: 0.9,
    materialTax: 0.086,
    notes: 'Strong remodel market, durable finishes recommended for heat.',
  },
]

const supplierBenchmarks = [
  { name: 'Big-box retailer', multiplier: 1 },
  { name: 'Local pro supplier', multiplier: 0.94 },
  { name: 'Specialty showroom', multiplier: 1.17 },
]

const getOption = (options: Option[], targetId: string) =>
  options.find((option) => option.id === targetId) ?? options[0]

function App() {
  const [projectId, setProjectId] = useState(projects[0].id)
  const [locationId, setLocationId] = useState(locationProfiles[0].id)
  const [quantity, setQuantity] = useState(1)
  const [qualityTier, setQualityTier] =
    useState<keyof typeof qualityTiers>('standard')
  const [frameOptionId, setFrameOptionId] = useState(projects[0].frameOptions[0].id)
  const [performanceOptionId, setPerformanceOptionId] = useState(
    projects[0].performanceOptions[0].id,
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [includePermit, setIncludePermit] = useState(true)

  const activeProject = useMemo(
    () => projects.find((project) => project.id === projectId) ?? projects[0],
    [projectId],
  )

  const activeLocation = useMemo(
    () =>
      locationProfiles.find((location) => location.id === locationId) ??
      locationProfiles[0],
    [locationId],
  )

  const quality = qualityTiers[qualityTier]
  const selectedFrame = getOption(activeProject.frameOptions, frameOptionId)
  const selectedPerformance = getOption(
    activeProject.performanceOptions,
    performanceOptionId,
  )
  const selectedExtraOptions = activeProject.extras.filter((option) =>
    selectedExtras.includes(option.id),
  )

  const breakdown = useMemo(() => {
    const safeQuantity = Math.max(1, quantity)

    const baseMaterialCost =
      activeProject.baseMaterialCost *
      safeQuantity *
      quality.materialMultiplier *
      activeLocation.materialIndex

    const optionsMaterialCost =
      (selectedFrame.materialAdd +
        selectedPerformance.materialAdd +
        selectedExtraOptions.reduce(
          (sum, extraOption) => sum + extraOption.materialAdd,
          0,
        )) *
      safeQuantity *
      activeLocation.materialIndex

    const materialSubtotal = baseMaterialCost + optionsMaterialCost

    const baseLaborHours =
      activeProject.baseLaborHours * safeQuantity * quality.laborMultiplier
    const optionsLaborHours =
      (selectedFrame.laborHoursAdd +
        selectedPerformance.laborHoursAdd +
        selectedExtraOptions.reduce(
          (sum, extraOption) => sum + extraOption.laborHoursAdd,
          0,
        )) *
      safeQuantity

    const totalLaborHours = baseLaborHours + optionsLaborHours
    const laborCost = totalLaborHours * activeLocation.laborRate
    const permitCost = includePermit
      ? activeProject.basePermitFee * activeLocation.permitIndex
      : 0
    const materialTax = materialSubtotal * activeLocation.materialTax
    const subtotal = materialSubtotal + laborCost + permitCost + materialTax
    const contingency = subtotal * activeProject.contingencyPct
    const total = subtotal + contingency

    return {
      materialSubtotal,
      laborCost,
      permitCost,
      materialTax,
      contingency,
      total,
      lowRange: total * 0.92,
      highRange: total * 1.12,
      totalLaborHours,
      costPerUnit: total / safeQuantity,
    }
  }, [
    activeLocation,
    activeProject,
    includePermit,
    quantity,
    quality.laborMultiplier,
    quality.materialMultiplier,
    selectedExtraOptions,
    selectedFrame.laborHoursAdd,
    selectedFrame.materialAdd,
    selectedPerformance.laborHoursAdd,
    selectedPerformance.materialAdd,
  ])

  const toggleExtra = (optionId: string) => {
    setSelectedExtras((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    )
  }

  const handleProjectChange = (nextProjectId: string) => {
    const nextProject = projects.find((project) => project.id === nextProjectId)
    if (!nextProject) {
      return
    }

    setProjectId(nextProject.id)
    setFrameOptionId(nextProject.frameOptions[0].id)
    setPerformanceOptionId(nextProject.performanceOptions[0].id)
    setSelectedExtras([])
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Home Improvement Cost Planner</p>
        <h1>Get a local cost breakdown before hiring a contractor</h1>
        <p className="subtitle">
          Compare material packages, labor averages, and upgrade options for your
          neighborhood in minutes.
        </p>
      </header>

      <section className="workspace" aria-label="Estimator">
        <article className="panel estimator-inputs">
          <h2>Project inputs</h2>
          <p className="panel-description">
            Tune your material package, quality, and add-ons to see real-time
            cost changes.
          </p>

          <div className="field">
            <label htmlFor="project">Project type</label>
            <select
              id="project"
              value={projectId}
              onChange={(event) => handleProjectChange(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <small>{activeProject.summary}</small>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={locationId}
                onChange={(event) => setLocationId(event.target.value)}
              >
                {locationProfiles.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="quantity">
                Quantity ({activeProject.unitName}
                {quantity > 1 ? 's' : ''})
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value) || 1)}
              />
            </div>
          </div>

          <fieldset className="option-group">
            <legend>Quality tier</legend>
            <div className="chip-grid">
              {(Object.keys(qualityTiers) as Array<keyof typeof qualityTiers>).map(
                (tier) => (
                  <button
                    key={tier}
                    type="button"
                    className={qualityTier === tier ? 'chip active' : 'chip'}
                    onClick={() => setQualityTier(tier)}
                  >
                    {qualityTiers[tier].label}
                  </button>
                ),
              )}
            </div>
          </fieldset>

          <fieldset className="option-group">
            <legend>Frame or finish option</legend>
            <div className="radio-stack">
              {activeProject.frameOptions.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="frame-option"
                    checked={selectedFrame.id === option.id}
                    onChange={() => setFrameOptionId(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="option-group">
            <legend>Performance package</legend>
            <div className="radio-stack">
              {activeProject.performanceOptions.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="performance-option"
                    checked={selectedPerformance.id === option.id}
                    onChange={() => setPerformanceOptionId(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="option-group">
            <legend>Optional upgrades</legend>
            <div className="radio-stack">
              {activeProject.extras.map((option) => (
                <label key={option.id}>
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(option.id)}
                    onChange={() => toggleExtra(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="inline-toggle">
            <input
              type="checkbox"
              checked={includePermit}
              onChange={(event) => setIncludePermit(event.target.checked)}
            />
            Include local permit fees
          </label>
        </article>

        <article className="panel estimate-results">
          <h2>Estimated budget</h2>
          <p className="location-note">{activeLocation.notes}</p>

          <p className="headline-total">{currency.format(breakdown.total)}</p>
          <p className="range">
            Typical range: {currency.format(breakdown.lowRange)} -{' '}
            {currency.format(breakdown.highRange)}
          </p>

          <dl className="breakdown-list">
            <div>
              <dt>Materials (localized)</dt>
              <dd>{currency.format(breakdown.materialSubtotal)}</dd>
            </div>
            <div>
              <dt>Labor ({Math.ceil(breakdown.totalLaborHours)} hrs avg)</dt>
              <dd>{currency.format(breakdown.laborCost)}</dd>
            </div>
            <div>
              <dt>Permit allowance</dt>
              <dd>{currency.format(breakdown.permitCost)}</dd>
            </div>
            <div>
              <dt>Materials tax</dt>
              <dd>{currency.format(breakdown.materialTax)}</dd>
            </div>
            <div>
              <dt>Contingency ({Math.round(activeProject.contingencyPct * 100)}%)</dt>
              <dd>{currency.format(breakdown.contingency)}</dd>
            </div>
            <div className="strong">
              <dt>Cost per {activeProject.unitName}</dt>
              <dd>{currency.format(breakdown.costPerUnit)}</dd>
            </div>
          </dl>

          <section className="supplier-card" aria-label="Material source comparison">
            <h3>Material cost by supplier type</h3>
            <ul>
              {supplierBenchmarks.map((supplier) => (
                <li key={supplier.name}>
                  <span>{supplier.name}</span>
                  <strong>
                    {currency.format(
                      breakdown.materialSubtotal * supplier.multiplier,
                    )}
                  </strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="suggestions">
            <h3>Smart homeowner suggestions</h3>
            <ul>
              {activeProject.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </section>
        </article>
      </section>
    </main>
  )
}

export default App
