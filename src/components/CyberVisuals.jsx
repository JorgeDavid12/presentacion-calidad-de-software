import { useEffect, useRef } from 'react'
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Bug,
  Check,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Code2,
  Database,
  Eye,
  FileCheck2,
  FileSearch,
  Gauge,
  GitBranch,
  GraduationCap,
  Link2,
  LockKeyhole,
  MonitorCog,
  MousePointer2,
  Network,
  Play,
  RadioTower,
  RefreshCw,
  ScanLine,
  ScanSearch,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TriangleAlert,
  UserRound,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

const signalIcons = [Target, Search, ShieldCheck, Database, Terminal, Activity, FileCheck2, Network]
const journeyIcons = [Target, Search, Code2, Boxes, Play, Wrench, ShieldCheck, Archive]

function Reveal({ beat = 1, className = '', children }) {
  return (
    <div className={'reveal-shell ' + className} data-reveal data-beat={String(beat)}>
      {children}
    </div>
  )
}

function NeonTag({ children, tone = 'cyan', className = '' }) {
  return <span className={'neon-tag neon-tag--' + tone + ' ' + className}>{children}</span>
}

function FlowArrow({ vertical = false }) {
  return vertical
    ? <ArrowDown className="flow-arrow" aria-hidden="true" />
    : <ArrowRight className="flow-arrow" aria-hidden="true" />
}

function HeroCore({ closing = false }) {
  return (
    <div className={'hero-core ' + (closing ? 'hero-core--closing' : '')}>
      <div className="hero-core__halo hero-core__halo--one" />
      <div className="hero-core__halo hero-core__halo--two" />
      <div className="hero-core__halo hero-core__halo--three" />
      <div className="hero-core__circuit hero-core__circuit--one" />
      <div className="hero-core__circuit hero-core__circuit--two" />
      <div className="hero-core__reticle-anchor">
        <Reveal beat={2} className="hero-core__reticle-reveal">
          <div className="hero-core__reticle">
            {closing ? <CheckCircle2 aria-hidden="true" /> : <ScanSearch aria-hidden="true" />}
          </div>
        </Reveal>
      </div>
      <div className="hero-core__scan" />
    </div>
  )
}

function CoverVisual({ closing = false }) {
  return (
    <div className={'cyber-visual cyber-visual--hero city-diagnostic ' + (closing ? 'is-closing' : '')}>
      <div className="city-diagnostic__vanishing-grid" />
      <div className="city-diagnostic__depth city-diagnostic__depth--far" />
      <div className="city-diagnostic__depth city-diagnostic__depth--near" />
      <HeroCore closing={closing} />
      <div className="skyline skyline--left" />
      <div className="skyline skyline--right" />
      <div className="signal-line signal-line--a" />
      <div className="signal-line signal-line--b" />
      <div className="city-diagnostic__shutter city-diagnostic__shutter--one" />
      <div className="city-diagnostic__shutter city-diagnostic__shutter--two" />
      {closing && (
        <Reveal beat={3} className="cyber-core-status-reveal">
          <div className="cyber-core-status">
            <span>TRANSMISSION COMPLETE</span>
            <strong>SESSION CLOSED</strong>
            <small>SYSTEM STANDBY</small>
          </div>
        </Reveal>
      )}
    </div>
  )
}

function TeamVisual({ content }) {
  return (
    <div className="cyber-visual team-network urban-cast">
      <div className="urban-cast__street" />
      <div className="urban-cast__horizon" />
      <Reveal beat={1} className="urban-cast__broadcast-reveal">
        <div className="urban-cast__broadcast">
          <RadioTower aria-hidden="true" />
          <span>04 SIGNALS</span>
          <strong>ONE PROCESS</strong>
        </div>
      </Reveal>
      <div className="urban-cast__facades">
        {content.members.map((member, index) => {
          const Icon = signalIcons[index]
          return (
            <div className="urban-cast__facade-anchor" key={member.name} style={{ '--i': index }}>
              <Reveal beat={index + 1} className="urban-cast__facade-reveal">
                <section className="urban-cast__facade">
                  <div className="urban-cast__antenna" />
                  <span className="urban-cast__vertical">BLOQUE {member.block}</span>
                  <Icon aria-hidden="true" />
                  <strong>{member.name}</strong>
                  <small>{member.focus}</small>
                  <i>ON AIR</i>
                </section>
              </Reveal>
            </div>
          )
        })}
      </div>
      <div className="urban-cast__cable urban-cast__cable--one" />
      <div className="urban-cast__cable urban-cast__cable--two" />
    </div>
  )
}

function ThesisVisual({ content }) {
  return (
    <div className="cyber-visual process-timeline process-signal">
      <div className="process-signal__giant-word" aria-hidden="true">PROCESO</div>
      <Reveal beat={1} className="process-signal__question-reveal">
        <div className="timeline-question">
          <ScanSearch aria-hidden="true" />
          <span>¿FUNCIONA?</span>
          <i>NO ES LA ÚNICA PREGUNTA</i>
        </div>
      </Reveal>
      <div className="timeline-track">
        <div className="timeline-track__wire" data-flow-line="horizontal" data-flow-beat="1" />
        {content.timeline.map((item, index) => (
          <Reveal beat={index + 1} className="timeline-phase-reveal" key={item.phase}>
            <div className={'timeline-phase ' + (index === 1 ? 'is-core' : '')}>
              <i>0{index + 1}</i>
              <span>{item.phase}</span>
              <strong>{item.label}</strong>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="objective-orbit-reveal">
        <div className="objective-orbit">
          {content.objectives.map((objective, index) => (
            <NeonTag key={objective} tone={index % 2 ? 'magenta' : 'cyan'}>
              {objective}
            </NeonTag>
          ))}
        </div>
      </Reveal>
      <Reveal beat={4} className="visual-mantra-reveal">
        <p className="visual-mantra">{content.takeaway}</p>
      </Reveal>
    </div>
  )
}

function ModelMapVisual({ content }) {
  return (
    <div className="cyber-visual model-map model-resolution">
      {content.models.map((model, row) => (
        <Reveal beat={row + 1} className="model-lane-reveal" key={model.name}>
          <div className="model-lane" style={{ '--lane': row }}>
            <div className="model-lane__label">
              <strong>0{model.count}</strong>
              <span>{model.name}</span>
              <em>nivel {row + 1}</em>
            </div>
            <div className="model-lane__track" style={{ '--count': model.stages.length }}>
              {model.stages.map((stage, index) => (
                <span className="model-stop" key={stage}>
                  <i>{index + 1}</i>
                  <b>{stage}</b>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
      <Reveal beat={4} className="model-map__note-reveal">
        <p className="visual-mantra model-map__note">{content.note}</p>
      </Reveal>
    </div>
  )
}

function QuestionGridVisual({ content }) {
  return (
    <div className="cyber-visual question-orbit plan-radar">
      <div className="plan-radar__rings" />
      <div className="question-orbit__core-anchor">
        <Reveal beat={1} className="question-orbit__core-reveal">
          <div className="question-orbit__core">
            <Target aria-hidden="true" />
            <span>PLAN</span>
            <small>antes de ejecutar</small>
          </div>
        </Reveal>
      </div>
      {content.questions.map((question, index) => (
        <div className="question-node-anchor" key={question.key} style={{ '--i': index, '--total': content.questions.length }}>
          <Reveal beat={Math.floor(index / 2) + 1} className="question-node-reveal">
            <div className="question-node">
              <span>0{index + 1}</span>
              <strong>{question.key}</strong>
              <small>{question.answer}</small>
            </div>
          </Reveal>
        </div>
      ))}
      <Reveal beat={4} className="question-orbit__principle-reveal">
        <p className="visual-mantra question-orbit__principle">{content.principle}</p>
      </Reveal>
    </div>
  )
}

function PlanTableVisual({ content }) {
  return (
    <div className="cyber-visual plan-ledger plan-blueprint">
      <div className="plan-blueprint__word" aria-hidden="true">PLAN</div>
      <div className="plan-ledger__table">
        <Reveal beat={1} className="plan-ledger__header-reveal">
          <div className="plan-ledger__header">
            <span>ELEMENTO</span><span>PREGUNTA</span><span>EJEMPLO</span>
          </div>
        </Reveal>
        {content.rows.map((row, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 4)} className="plan-ledger__row-reveal" key={row.element}>
            <div className="plan-ledger__row">
              <strong><i>0{index + 1}</i>{row.element}</strong>
              <span>{row.question}</span>
              <span>{row.example}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="plan-ledger__stamp-reveal">
        <aside className="plan-ledger__stamp">
          <ClipboardCheck aria-hidden="true" />
          <span>ACUERDOS</span>
          <strong>VISIBLES</strong>
        </aside>
      </Reveal>
      <Reveal beat={4} className="plan-blueprint__callout-reveal">
        <p className="plan-blueprint__callout">{content.callout}</p>
      </Reveal>
    </div>
  )
}

function RiskMatrixVisual({ content }) {
  const cellFor = (example) => {
    const x = { baja: 1, media: 2, alta: 3 }[example.probability] || 2
    const y = { bajo: 3, medio: 2, alto: 1 }[example.impact] || 2
    return { gridColumn: x, gridRow: y }
  }
  return (
    <div className="cyber-visual risk-stage risk-reactor">
      <div className="risk-reactor__beam" />
      <div className="risk-matrix">
        <span className="risk-matrix__axis risk-matrix__axis--y">IMPACTO</span>
        <span className="risk-matrix__axis risk-matrix__axis--x">PROBABILIDAD</span>
        {Array.from({ length: 9 }, (_, index) => <div className={'risk-cell risk-cell--' + index} key={index} />)}
        {content.examples.map((example, index) => (
          <div className="risk-token-anchor" key={example.label} style={cellFor(example)}>
            <Reveal beat={index + 1} className="risk-token-reveal">
              <div className={'risk-token risk-token--' + example.priority}>
                <TriangleAlert aria-hidden="true" />
                <span>{example.label}</span>
                <small>{example.priority}</small>
              </div>
            </Reveal>
          </div>
        ))}
        <div className="risk-reactor__scan" />
      </div>
      <aside className="risk-signals">
        <Reveal beat={1} className="risk-signals__heading-reveal">
          <strong>SEÑALES DE RIESGO</strong>
        </Reveal>
        {content.riskSignals.map((signal, index) => (
          <Reveal beat={Math.min(index + 1, 3)} className="risk-signal-reveal" key={signal}>
            <span><Zap aria-hidden="true" />{signal}</span>
          </Reveal>
        ))}
        <Reveal beat={4} className="risk-signals__rule-reveal">
          <p>{content.dynamicRule}</p>
          <small>{content.note}</small>
        </Reveal>
      </aside>
    </div>
  )
}

function MonitorControlVisual({ content }) {
  return (
    <div className="cyber-visual monitor-stage command-telemetry">
      <div className="command-telemetry__number" aria-hidden="true">{Math.abs(content.scenario.deviation)}</div>
      <div className="telemetry-panel">
        <Reveal beat={1} className="telemetry-panel__top-reveal">
          <div className="telemetry-panel__top">
            <span>{content.scenario.plannedCases} CASOS / {content.scenario.days} DÍAS</span>
            <strong>{content.scenario.checkpoint}</strong>
          </div>
        </Reveal>
        <Reveal beat={1} className="telemetry-bar-reveal">
          <div className="telemetry-bar telemetry-bar--plan">
            <span>PLAN</span><i style={{ '--bar': '100%' }} /><strong>{content.scenario.expected}</strong>
          </div>
        </Reveal>
        <Reveal beat={2} className="telemetry-bar-reveal">
          <div className="telemetry-bar telemetry-bar--real">
            <span>REAL</span><i style={{ '--bar': '50%' }} /><strong>{content.scenario.actual}</strong>
          </div>
        </Reveal>
        <Reveal beat={2} className="telemetry-gap-reveal">
          <div className="telemetry-gap"><Gauge aria-hidden="true" /><span>DESVIACIÓN</span><strong>{content.scenario.deviation}</strong></div>
        </Reveal>
      </div>
      <div className="control-router">
        {content.definitions.map((definition, index) => (
          <Reveal beat={index + 2} className="control-router__definition-reveal" key={definition.term}>
            <div className={'control-router__definition ' + (index ? 'is-control' : '')}>
              {index ? <MonitorCog aria-hidden="true" /> : <Eye aria-hidden="true" />}
              <strong>{definition.term}</strong><span>{definition.meaning}</span>
            </div>
          </Reveal>
        ))}
        <Reveal beat={3} className="control-router__actions-reveal">
          <div className="control-router__actions">
            {content.actions.map((action, index) => <NeonTag tone={index % 2 ? 'yellow' : 'cyan'} key={action}>{action}</NeonTag>)}
          </div>
        </Reveal>
      </div>
      <Reveal beat={4} className="command-telemetry__mantra-reveal">
        <div className="command-telemetry__mantra">
          {content.mantra.map((item) => <span key={item}>{item}</span>)}
        </div>
      </Reveal>
    </div>
  )
}

function OutputPipelineVisual({ content }) {
  return (
    <div className="cyber-visual output-pipeline artifact-cable">
      <Reveal beat={1} className="artifact-cable__source-reveal">
        <div className="output-pipeline__source">
          <RadioTower aria-hidden="true" /><strong>PLANIFICACIÓN<br />+ CONTROL</strong>
        </div>
      </Reveal>
      <div className="artifact-cable__wire" data-flow-line="horizontal" data-flow-beat="1" />
      <div className="output-pipeline__packets">
        {content.outputs.map((output, index) => {
          const Icon = signalIcons[index % signalIcons.length]
          return (
            <div className="output-packet-anchor" key={output.label} style={{ '--i': index }}>
              <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="output-packet-reveal">
                <div className="output-packet">
                  <Icon aria-hidden="true" />
                  <strong>{output.label}</strong>
                  <span>{output.purpose}</span>
                </div>
              </Reveal>
            </div>
          )
        })}
      </div>
      <Reveal beat={4} className="artifact-cable__gate-reveal">
        <div className="output-pipeline__gate">
          <ScanLine aria-hidden="true" /><span>SIGUIENTE BLOQUE</span><strong>ANÁLISIS + DISEÑO</strong>
        </div>
      </Reveal>
      <Reveal beat={4} className="artifact-cable__feed-reveal">
        <p>{content.feeds}</p>
      </Reveal>
    </div>
  )
}

function CasePlanVisual({ content }) {
  return (
    <div className="cyber-visual mission-brief login-blueprint">
      <div className="login-blueprint__grid" />
      <Reveal beat={1} className="mission-brief__seal-reveal">
        <div className="mission-brief__seal">
          <LockKeyhole aria-hidden="true" />
          <span>LOGIN / QA</span>
          <strong>PLAN</strong>
        </div>
      </Reveal>
      <div className="mission-brief__grid">
        {content.brief.map((item, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="mission-brief__line-reveal" key={item.label}>
            <div className="mission-brief__line">
              <span>0{index + 1} / {item.label}</span>
              <i />
              <strong>{item.value}</strong>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="mission-brief__exit-reveal">
        <div className="mission-brief__exit">
          <span>EXIT CRITERIA</span>
          {content.exitCriteria.map((criterion) => <strong key={criterion}><Check aria-hidden="true" />{criterion}</strong>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="login-blueprint__boundary-reveal">
        <p className="login-blueprint__boundary">{content.boundary}</p>
      </Reveal>
    </div>
  )
}

function SplitQuestionVisual({ content }) {
  return (
    <div className="cyber-visual split-lens analysis-prism">
      <div className="analysis-prism__slash" />
      {content.columns.map((column, index) => (
        <Reveal beat={index + 1} className={'split-lens__side-reveal split-lens__side-reveal--' + index} key={column.label}>
          <section className={'split-lens__side split-lens__side--' + index}>
            {index === 0 ? <Search aria-hidden="true" /> : <Code2 aria-hidden="true" />}
            <span>{column.label}</span>
            <strong>{column.key}</strong>
            <p>{column.purpose}</p>
            <div>{column.examples.map((example) => <NeonTag tone={index ? 'magenta' : 'cyan'} key={example}>{example}</NeonTag>)}</div>
          </section>
        </Reveal>
      ))}
      <Reveal beat={3} className="split-lens__flow-reveal">
        <div className="split-lens__flow">
          {content.flow.map((step, index) => <span key={step}><b>{step}</b>{index < content.flow.length - 1 && <FlowArrow />}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="analysis-prism__sources-reveal">
        <div className="analysis-prism__sources">
          {content.sources.map((source) => <span key={source}>{source}</span>)}
        </div>
      </Reveal>
    </div>
  )
}

function SourceFunnelVisual({ content }) {
  return (
    <div className="cyber-visual source-funnel evidence-intake">
      <div className="evidence-intake__cone" />
      <div className="source-funnel__sources">
        {content.sources.map((source, index) => {
          const Icon = signalIcons[index % signalIcons.length]
          return (
            <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="source-funnel__source-reveal" key={source}>
              <span><Icon aria-hidden="true" />{source}</span>
            </Reveal>
          )
        })}
      </div>
      <div className="source-funnel__beam source-funnel__beam--in" data-flow-line="horizontal" data-flow-beat="1"><FlowArrow /></div>
      <Reveal beat={2} className="source-funnel__core-reveal">
        <div className="source-funnel__core">
          <FileSearch aria-hidden="true" />
          <strong>{content.output}</strong>
          <small>{content.example.rule}</small>
        </div>
      </Reveal>
      <div className="source-funnel__beam source-funnel__beam--out" data-flow-line="horizontal" data-flow-beat="2"><FlowArrow /></div>
      <Reveal beat={3} className="evidence-intake__questions-reveal">
        <div className="evidence-intake__questions">
          {content.example.questions.map((question) => <span key={question}>{question}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="ambiguity-alert-reveal">
        <aside className="ambiguity-alert">
          <ShieldAlert aria-hidden="true" />
          <span>AMBIGÜEDAD DETECTADA</span>
          <strong>“{content.ambiguity.text}”</strong>
          <p>{content.ambiguity.issue}</p>
          <small>{content.ambiguity.lesson}</small>
        </aside>
      </Reveal>
    </div>
  )
}

function ConditionTreeVisual({ content }) {
  return (
    <div className="cyber-visual condition-tree requirement-neuron">
      <svg className="requirement-neuron__wires" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        {[80, 260, 440, 620, 800, 970].map((x) => (
          <path
            key={x}
            d={'M500 105 C500 220 ' + x + ' 215 ' + x + ' 380'}
            data-flow-line="path"
            data-flow-beat="2"
          />
        ))}
      </svg>
      <Reveal beat={1} className="condition-tree__root-reveal">
        <div className="condition-tree__root">
          <LockKeyhole aria-hidden="true" /><span>REQUISITO</span><strong>{content.requirement}</strong>
        </div>
      </Reveal>
      <div className="condition-tree__branches">
        {content.conditions.map((condition, index) => (
          <div className="condition-leaf-anchor" key={condition.id} style={{ '--i': index }}>
            <Reveal beat={Math.min(Math.floor(index / 2) + 2, 4)} className="condition-leaf-reveal">
              <div className={'condition-leaf condition-leaf--' + condition.type}>
                <span>{condition.id}</span><strong>{condition.label}</strong><small>{condition.type}</small>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <Reveal beat={4} className="requirement-neuron__principle-reveal">
        <p className="visual-mantra">{content.principle}</p>
      </Reveal>
    </div>
  )
}

function PriorityQueueVisual({ content }) {
  return (
    <div className="cyber-visual priority-stage priority-transmission">
      <div className="priority-transmission__giant" aria-hidden="true">P0</div>
      <aside className="priority-criteria">
        <Reveal beat={1} className="priority-criteria__heading-reveal">
          <div><Target aria-hidden="true" /><strong>SEÑALES</strong></div>
        </Reveal>
        {content.criteria.map((criterion, index) => (
          <Reveal beat={Math.min(index + 1, 3)} className="priority-criterion-reveal" key={criterion}>
            <span><i>0{index + 1}</i>{criterion}</span>
          </Reveal>
        ))}
      </aside>
      <div className="priority-queue">
        {content.rows.map((row, index) => (
          <Reveal beat={index + 1} className="priority-row-reveal" key={row.condition}>
            <div className={'priority-row priority-row--' + row.priority.toLowerCase()}>
              <span className="priority-row__rank">0{index + 1}</span>
              <strong>{row.condition}</strong>
              <i className="priority-row__line" />
              <small>{row.reason}</small>
              <NeonTag tone={row.priority === 'ALTA' ? 'magenta' : row.priority === 'MEDIA' ? 'yellow' : 'cyan'}>{row.priority}</NeonTag>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={4} className="priority-stage__note-reveal">
        <p className="visual-mantra priority-stage__note">{content.note}</p>
      </Reveal>
    </div>
  )
}

function CaseMatrixVisual({ content }) {
  const [featured, ...remaining] = content.rows
  return (
    <div className="cyber-visual case-terminal case-assembler">
      <Reveal beat={1} className="case-terminal__bar-reveal">
        <div className="case-terminal__bar">
          <Terminal aria-hidden="true" /><span>CASE ASSEMBLER</span><i>LIVE</i>
        </div>
      </Reveal>
      <div className="case-assembler__featured">
        <Reveal beat={1} className="case-assembler__id-reveal"><strong>{featured.id}</strong></Reveal>
        {[featured.condition, featured.data, featured.expected].map((value, index) => (
          <Reveal beat={index + 1} className="case-assembler__part-reveal" key={value}>
            <div className="case-assembler__part">
              <span>{content.columns[index + 1]}</span><b>{value}</b>
              {index < 2 && <FlowArrow />}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="case-terminal__table-reveal">
        <div className="case-terminal__table">
          {remaining.map((row) => (
            <div className="case-terminal__row" key={row.id}>
              <strong>{row.id}</strong><span>{row.condition}</span><span>{row.data}</span><em>{row.expected}</em>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal beat={4} className="case-terminal__anatomy-reveal">
        <div className="case-terminal__anatomy">
          {content.anatomy.map((item, index) => <span key={item}><i>0{index + 1}</i>{item}</span>)}
        </div>
        <p className="case-assembler__technique">{content.techniqueHint}</p>
      </Reveal>
    </div>
  )
}

function DependencyOrbitVisual({ content }) {
  return (
    <div className="cyber-visual dependency-system dependency-constellation">
      <div className="dependency-system__orbit dependency-system__orbit--one" />
      <div className="dependency-system__orbit dependency-system__orbit--two" />
      <div className="dependency-system__core-anchor">
        <Reveal beat={1} className="dependency-system__core-reveal">
          <div className="dependency-system__core">
            <Boxes aria-hidden="true" /><strong>{content.core}</strong><span>REPRODUCIBLE</span>
          </div>
        </Reveal>
      </div>
      {content.dependencies.map((dependency, index) => {
        const Icon = signalIcons[index % signalIcons.length]
        return (
          <div className="dependency-node-anchor" key={dependency.label} style={{ '--i': index, '--total': content.dependencies.length }}>
            <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="dependency-node-reveal">
              <div className="dependency-node">
                <Icon aria-hidden="true" /><strong>{dependency.label}</strong><small>{dependency.example}</small>
              </div>
            </Reveal>
          </div>
        )
      })}
      <Reveal beat={3} className="dependency-system__boundary-reveal">
        <div className="dependency-system__boundary">
          <span><b>DISEÑO</b>{content.boundary.design}</span><FlowArrow /><span><b>IMPLEMENTACIÓN</b>{content.boundary.implementation}</span>
        </div>
      </Reveal>
      <Reveal beat={4} className="dependency-constellation__goal-reveal">
        <p className="visual-mantra">{content.goal}</p>
      </Reveal>
    </div>
  )
}

function TraceChainVisual({ content }) {
  return (
    <div className="cyber-visual trace-stage evidence-laser">
      <div className="evidence-laser__beam" data-flow-line="horizontal" data-flow-beat="1" />
      <div className="trace-chain">
        {content.chain.map((node, index) => (
          <div className="trace-link-anchor" key={node.type} style={{ '--i': index, '--total': content.chain.length }}>
            <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="trace-link-reveal">
              <div className={'trace-link ' + (node.value === 'FAILED' ? 'is-failed' : '')}>
                <i>0{index + 1}</i>
                <span>{node.type}</span>
                <strong>{node.value}</strong>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
      <Reveal beat={3} className="trace-proof-reveal">
        <aside className="trace-proof">
          <Link2 aria-hidden="true" /><span>PRUEBA DE COBERTURA</span><strong>{content.proof}</strong>
        </aside>
      </Reveal>
      <Reveal beat={4} className="trace-answers-reveal">
        <div className="trace-answers">
          {content.answers.map((answer, index) => <span key={answer}><i>0{index + 1}</i>{answer}</span>)}
        </div>
      </Reveal>
      <div className="evidence-laser__pulse" />
    </div>
  )
}

function AntiPatternsVisual({ content }) {
  return (
    <div className="cyber-visual fault-array design-corruption">
      <div className="design-corruption__core">
        <ScanLine aria-hidden="true" />
        <strong>CASO</strong>
        <span>INTEGRIDAD COMPROMETIDA</span>
      </div>
      <div className="design-corruption__rings" />
      {content.items.map((item, index) => (
        <div className="fault-node-anchor" key={item.code} style={{ '--i': index, '--total': content.items.length }}>
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="fault-node-reveal">
            <div className="fault-node">
              <TriangleAlert aria-hidden="true" />
              <span>{item.code}</span>
              <strong>{item.mistake}</strong>
              <small>{item.consequence}</small>
            </div>
          </Reveal>
        </div>
      ))}
      <Reveal beat={4} className="fault-array__handoff-reveal">
        <div className="fault-array__handoff">
          <RadioTower aria-hidden="true" /><span>HANDOFF READY</span><strong>{content.handoff}</strong>
        </div>
      </Reveal>
    </div>
  )
}

function PrepareRunVisual({ content }) {
  return (
    <div className="cyber-visual dual-chamber prepare-run-reactor">
      <div className="prepare-run-reactor__divider" />
      {content.phases.map((phase, index) => (
        <Reveal beat={index + 1} className={'dual-chamber__cell-reveal dual-chamber__cell-reveal--' + index} key={phase.label}>
          <section className={'dual-chamber__cell dual-chamber__cell--' + index}>
            {index === 0 ? <Wrench aria-hidden="true" /> : <Play aria-hidden="true" />}
            <span>{phase.label}</span><strong>{phase.action}</strong>
            <div>{phase.items.map((item) => <NeonTag tone={index ? 'magenta' : 'cyan'} key={item}>{item}</NeonTag>)}</div>
          </section>
        </Reveal>
      ))}
      <Reveal beat={3} className="dual-chamber__bridge-reveal">
        <div className="dual-chamber__bridge">
          {content.bridge.map((item, index) => <span key={item}>{item}{index < content.bridge.length - 1 && <i />}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="prepare-run-reactor__caution-reveal">
        <p className="visual-mantra">{content.caution}</p>
      </Reveal>
    </div>
  )
}

function ExecutableCardVisual({ content }) {
  const testCase = content.testCase
  return (
    <div className="cyber-visual qa-console executable-schematic">
      <div className="executable-schematic__crosshair" />
      <Reveal beat={1} className="qa-console__title-reveal">
        <div className="qa-console__title">
          <Terminal aria-hidden="true" /><strong>CP-LOGIN-001</strong><span>READY TO RUN</span>
        </div>
      </Reveal>
      <Reveal beat={1} className="qa-console__objective-reveal">
        <div className="qa-console__objective"><Target aria-hidden="true" /><span>OBJETIVO</span><strong>{testCase.objective}</strong></div>
      </Reveal>
      <div className="qa-console__grid">
        <Reveal beat={2} className="qa-console__rail-reveal">
          <div className="qa-console__rail"><span>PRECONDICIONES</span>{testCase.preconditions.map((item) => <strong key={item}><Check aria-hidden="true" />{item}</strong>)}</div>
        </Reveal>
        <Reveal beat={2} className="qa-console__rail-reveal">
          <div className="qa-console__rail"><span>DATOS</span><strong>{testCase.data.email}</strong><strong>{testCase.data.password}</strong></div>
        </Reveal>
        <Reveal beat={3} className="qa-console__rail-reveal">
          <div className="qa-console__rail qa-console__steps"><span>PASOS</span>{testCase.steps.map((item, index) => <strong key={item}><i>{index + 1}</i>{item}</strong>)}</div>
        </Reveal>
        <Reveal beat={3} className="qa-console__rail-reveal">
          <div className="qa-console__rail qa-console__expected"><span>RESULTADO ESPERADO</span><CheckCircle2 aria-hidden="true" /><strong>{testCase.expected}</strong></div>
        </Reveal>
      </div>
      <Reveal beat={4} className="qa-console__suites-reveal">
        <div className="qa-console__suites">{content.suites.map((suite) => <NeonTag tone="cyan" key={suite}>{suite}</NeonTag>)}</div>
        <p className="executable-schematic__benefit">{content.benefit}</p>
      </Reveal>
    </div>
  )
}

function EnvironmentVisual({ content }) {
  return (
    <div className="cyber-visual environment-topology execution-fingerprint">
      <div className="execution-fingerprint__layers" />
      <div className="environment-stack">
        <Reveal beat={1} className="environment-stack__header-reveal">
          <div className="environment-stack__header"><Server aria-hidden="true" /><span>EXECUTION FINGERPRINT</span><strong>LOCKED</strong></div>
        </Reveal>
        {content.snapshot.map((item, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="environment-stack__layer-reveal" key={item.label}>
            <div className="environment-stack__layer" style={{ '--i': index }}>
              <span>{item.label}</span><i /><strong>{item.value}</strong>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="environment-risks-reveal">
        <aside className="environment-risks">
          <ShieldAlert aria-hidden="true" />
          <strong>{content.maxim}</strong>
          {content.risks.map((risk) => <span key={risk}><CircleDot aria-hidden="true" />{risk}</span>)}
        </aside>
      </Reveal>
      <Reveal beat={4} className="environment-deps-reveal">
        <div className="environment-deps">{content.dependencies.map((item) => <NeonTag tone="magenta" key={item}>{item}</NeonTag>)}</div>
      </Reveal>
    </div>
  )
}

function ExecutionSequenceVisual({ content }) {
  return (
    <div className="cyber-visual launch-runway suite-rail">
      <div className="suite-rail__perspective" />
      <div className="launch-runway__track">
        {content.queue.map((item, index) => (
          <Reveal beat={Math.min(index + 1, 3)} className="launch-stop-reveal" key={item.suite}>
            <div className="launch-stop">
              <span>{item.priority}</span><i>{item.order}</i><strong>{item.suite}</strong><small>{item.purpose}</small>
              {index < content.queue.length - 1 && <FlowArrow />}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="launch-runway__rules-reveal">
        <div className="launch-runway__rules">{content.rules.map((rule) => <NeonTag tone="yellow" key={rule}>{rule}</NeonTag>)}</div>
      </Reveal>
      <Reveal beat={4} className="launch-runway__stop-reveal">
        <div className="launch-runway__stop"><X aria-hidden="true" /><strong>SMOKE FALLA</strong><span>{content.stopRule}</span></div>
      </Reveal>
    </div>
  )
}

function ResultDecisionVisual({ content }) {
  return (
    <div className="cyber-visual comparison-gate forensic-collision">
      <Reveal beat={1} className="comparison-flow-reveal">
        <div className="comparison-flow">{content.flow.map((item, index) => <span key={item}><b>{item}</b>{index < content.flow.length - 1 && <FlowArrow />}</span>)}</div>
      </Reveal>
      <div className="comparison-beams">
        <Reveal beat={1} className="comparison-beam-reveal">
          <div className="comparison-beam comparison-beam--expected"><span>ESPERADO · {content.example.case}</span><strong>{content.example.expected}</strong></div>
        </Reveal>
        <div className="comparison-core-anchor">
          <Reveal beat={2} className="comparison-core-reveal">
            <div className="comparison-core"><ScanSearch aria-hidden="true" /><strong>≠</strong><span>COMPARAR</span></div>
          </Reveal>
        </div>
        <Reveal beat={2} className="comparison-beam-reveal">
            <div className="comparison-beam comparison-beam--actual"><span>REAL · {content.example.status}</span><strong data-glitch-target>{content.example.actual}</strong></div>
        </Reveal>
      </div>
      <div className="comparison-outcomes">
        {content.outcomes.map((outcome, index) => (
          <Reveal beat={3} className="comparison-outcome-reveal" key={outcome.status}>
            <div className={'comparison-outcome comparison-outcome--' + outcome.status.toLowerCase()}>
              {index === 0 ? <CheckCircle2 aria-hidden="true" /> : <TriangleAlert aria-hidden="true" />}
              <span>{outcome.condition}</span><strong>{outcome.status}</strong><small>{outcome.next}</small>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="forensic-collision__causes-reveal">
        <div className="forensic-collision__causes">{content.possibleCauses.map((cause) => <span key={cause}>{cause}</span>)}</div>
      </Reveal>
      <Reveal beat={4} className="forensic-collision__evidence-reveal">
        <div className="forensic-collision__evidence">
          <strong>EVIDENCIA</strong>
          {content.evidence.map((item) => <span key={item}>{item}</span>)}
        </div>
      </Reveal>
    </div>
  )
}

function CausalityVisual({ content }) {
  const causalIcons = [UserRound, Bug, Activity]
  return (
    <div className="cyber-visual causality-stage causal-transmission">
      <div className="causal-transmission__wire" />
      <div className="causal-chain">
        {content.chain.map((item, index) => {
          const Icon = causalIcons[index]
          return (
            <Reveal beat={index + 1} className="causal-node-reveal" key={item.term}>
              <div className={'causal-node causal-node--' + index}>
                <Icon aria-hidden="true" />
                <span>{item.term}</span><strong>{item.definition}</strong><small>{item.example}</small>
                {index < content.chain.length - 1 && <FlowArrow />}
              </div>
            </Reveal>
          )
        })}
      </div>
      <Reveal beat={3} className="bug-ticket-reveal">
        <aside className="bug-ticket">
          <div><Bug aria-hidden="true" /><span>BUG REPORT</span><strong>{content.bugReport.severity}</strong></div>
          <h3>{content.bugReport.title}</h3>
          <p><b>{content.bugReport.relatedCase}</b><b>BUILD {content.bugReport.build}</b></p>
          <span>Esperado: {content.bugReport.expected}</span><span>Obtenido: {content.bugReport.actual}</span>
          <div className="bug-ticket__must">{content.bugReport.mustInclude.map((item) => <i key={item}>{item}</i>)}</div>
        </aside>
      </Reveal>
      <Reveal beat={4} className="causal-transmission__distinction-reveal">
        <p className="visual-mantra">{content.distinction}</p>
      </Reveal>
    </div>
  )
}

function FixCycleVisual({ content }) {
  return (
    <div className="cyber-visual fix-stage retest-orbit">
      <div className="fix-cycle">
        <RefreshCw className="fix-cycle__icon" aria-hidden="true" />
        {content.cycle.map((item, index) => (
          <div className="fix-cycle__anchor" key={item} style={{ '--i': index, '--total': content.cycle.length }}>
            <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="fix-cycle__node-reveal">
              <span className={'fix-cycle__node ' + (item === 'FAILED' ? 'is-failed' : item === 'PASS' ? 'is-pass' : '')}>
                <i>0{index + 1}</i><strong>{item}</strong>
              </span>
            </Reveal>
          </div>
        ))}
      </div>
      <div className="fix-comparison">
        {content.comparisons.map((item, index) => (
          <Reveal beat={index + 2} className="fix-comparison__item-reveal" key={item.label}>
            <div className={'fix-comparison__item fix-comparison__item--' + index}>
              {index === 0 ? <Target aria-hidden="true" /> : <GitBranch aria-hidden="true" />}
              <span>{item.label}</span><strong>{item.question}</strong><small>{item.action}</small>
              <em>{content.example[index]}</em>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={4} className="retest-orbit__principle-reveal">
        <p className="visual-mantra">{content.principle}</p>
      </Reveal>
    </div>
  )
}

function ManualAutomationVisual({ content }) {
  return (
    <div className="cyber-visual balanced-modes human-machine">
      <div className="human-machine__split" />
      <div className="balanced-modes__columns">
        {content.modes.map((mode, index) => (
          <Reveal beat={index + 1} className={'mode-operator-reveal mode-operator-reveal--' + index} key={mode.label}>
            <section className={'mode-operator mode-operator--' + index}>
              {index === 0 ? <MousePointer2 aria-hidden="true" /> : <Bot aria-hidden="true" />}
              <span>{mode.label}</span><strong>{mode.definition}</strong>
              <div>{mode.strengths.map((strength) => <NeonTag tone={index ? 'magenta' : 'cyan'} key={strength}>{strength}</NeonTag>)}</div>
            </section>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="balanced-modes__spine-reveal">
        <div className="balanced-modes__spine">
          {content.commonProcess.map((item, index) => <span key={item}><i>{index + 1}</i>{item}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="balanced-modes__warning-reveal">
        <div className="balanced-modes__warning">
          <TriangleAlert aria-hidden="true" />
          {content.warnings.map((warning) => <span key={warning}>{warning}</span>)}
        </div>
      </Reveal>
    </div>
  )
}

function EvaluationGateVisual({ content }) {
  return (
    <div className="cyber-visual evaluation-stage false-finish">
      <div className="false-finish__track" />
      <Reveal beat={1} className="finish-counter-reveal">
        <div className="finish-counter"><span>CASOS EJECUTADOS</span><strong>100<span>/100</span></strong><small>¿TERMINAMOS?</small></div>
      </Reveal>
      <Reveal beat={2} className="evaluation-gate-reveal">
        <div className="evaluation-gate">
          <div className="evaluation-gate__beam" />
          <ShieldCheck aria-hidden="true" />
          <span>EVALUACIÓN</span><strong>¿SUFICIENTE PARA CERRAR?</strong>
        </div>
      </Reveal>
      <Reveal beat={2} className="false-finish__contrast-reveal">
        <div className="false-finish__contrast">
          <span>{content.contrast.executionQuestion}</span><FlowArrow /><strong>{content.contrast.evaluationQuestion}</strong>
        </div>
      </Reveal>
      <div className="evaluation-questions">
        {content.questions.map((question, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 2, 4)} className="evaluation-question-reveal" key={question}>
            <span><i>0{index + 1}</i>{question}</span>
          </Reveal>
        ))}
      </div>
      <Reveal beat={4} className="false-finish__truth-reveal">
        <p className="visual-mantra">{content.truth}</p>
        <small className="false-finish__boundary">{content.decisionBoundary}</small>
      </Reveal>
    </div>
  )
}

function ExitChecklistVisual({ content }) {
  return (
    <div className="cyber-visual exit-stage exit-lockdown">
      <div className="exit-lockdown__rail" />
      <div className="exit-locks">
        {content.criteria.map((criterion, index) => (
          <Reveal beat={Math.min(index + 1, 3)} className="exit-lock-reveal" key={criterion.label}>
            <div className={'exit-lock ' + (criterion.met ? 'is-met' : 'is-failed')}>
              <span>0{index + 1}</span>
              {criterion.met ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
              <strong data-glitch-target={criterion.met ? undefined : ''}>{criterion.label}</strong>
              <i />
              <small>OBJ {criterion.target} / REAL {criterion.actual}</small>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="exit-verdict-reveal">
        <aside className="exit-verdict">
          <LockKeyhole aria-hidden="true" /><span>VEREDICTO</span><strong>{content.status}</strong><p>{content.reason}</p>
        </aside>
      </Reveal>
      <Reveal beat={4} className="exit-verdict__response-reveal">
        <div className="exit-verdict__response">{content.response.map((item) => <NeonTag tone="yellow" key={item}>{item}</NeonTag>)}</div>
      </Reveal>
    </div>
  )
}

function MetricsVisual({ content }) {
  const metric = (label) => content.metrics.find((item) => item.label === label)
  return (
    <div className="cyber-visual metrics-stage metric-constellation">
      <div className="metric-constellation__axes" />
      <Reveal beat={1} className="metric-radar-reveal">
        <div className="metric-radar">
          <div className="metric-radar__rings" />
          <BarChart3 aria-hidden="true" />
          <span>EJECUTADOS</span><strong>{metric('Ejecutados').value}<i>/{metric('Planificados').value}</i></strong>
          <small>{metric('Cobertura').value}% cobertura</small>
        </div>
      </Reveal>
      <div className="metric-array">
        {content.metrics.filter((item) => !['Planificados', 'Ejecutados', 'Cobertura'].includes(item.label)).map((item, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 2, 3)} className="metric-signal-reveal" key={item.label}>
            <div className={'metric-signal ' + (item.label.includes('Críticos') ? 'is-critical' : item.label === 'PASS' ? 'is-pass' : '')}>
              <span>{item.label}</span><strong>{item.value}</strong><small>{item.unit}</small>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="metric-constellation__questions-reveal">
        <div className="metric-constellation__questions">
          {content.questions.map((question) => <span key={question}>{question}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="metrics-stage__context-reveal">
        <div className="metrics-stage__context"><TriangleAlert aria-hidden="true" /><strong>{content.principle}</strong><span>{content.caution}</span></div>
        <div className="metric-constellation__other">{content.otherSignals.map((item) => <i key={item}>{item}</i>)}</div>
      </Reveal>
    </div>
  )
}

function ReportVisual({ content }) {
  return (
    <div className="cyber-visual report-stage report-transmission">
      <div className="report-transmission__scanner" />
      <Reveal beat={1} className="intel-report__header-reveal">
        <div className="intel-report__header"><FileCheck2 aria-hidden="true" /><span>TEST COMPLETION REPORT</span><NeonTag tone="magenta">{content.statusExample.status}</NeonTag></div>
      </Reveal>
      <div className="intel-report__sections">
        {content.sections.map((section, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 3)} className="intel-report__section-reveal" key={section.label}>
            <div><span>0{index + 1}</span><strong>{section.label}</strong><small>{section.question}</small></div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="report-transmission__status-reveal">
        <p className="report-transmission__status"><ShieldAlert aria-hidden="true" />{content.statusExample.reason}</p>
      </Reveal>
      <Reveal beat={3} className="report-audiences-reveal">
        <div className="report-audiences">
          {content.audiences.map((audience, index) => (
            <span key={audience.role}>{index === 0 ? <Code2 aria-hidden="true" /> : <Users aria-hidden="true" />}<b>{audience.role}</b><small>{audience.needs}</small></span>
          ))}
        </div>
      </Reveal>
      <Reveal beat={4} className="report-transmission__types-reveal">
        <div className="report-transmission__types">{content.reportTypes.map((type) => <span key={type}>{type}</span>)}</div>
        <p className="visual-mantra">{content.principle}</p>
      </Reveal>
    </div>
  )
}

function ClosureVisual({ content }) {
  return (
    <div className="cyber-visual closure-stage archive-conveyor">
      <div className="archive-conveyor__belt" />
      <div className="closure-elevator">
        {content.steps.map((step, index) => (
          <Reveal beat={Math.min(Math.floor(index / 2) + 1, 4)} className="closure-stop-reveal" key={step.order}>
            <div className="closure-stop">
              <i>0{step.order}</i><strong>{step.label}</strong><span>{step.detail}</span>
              {index < content.steps.length - 1 && <FlowArrow />}
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={4} className="archive-vault-reveal">
        <aside className="archive-vault">
          <Archive aria-hidden="true" /><span>ARCHIVO / TRANSFERENCIA</span><strong>EVIDENCIA REUTILIZABLE</strong><small>Casos · datos · resultados · logs · reportes · suites</small>
        </aside>
      </Reveal>
      <Reveal beat={4} className="archive-conveyor__value-reveal">
        <p>{content.value}</p>
      </Reveal>
    </div>
  )
}

function LearningLoopVisual({ content }) {
  return (
    <div className="cyber-visual learning-stage memory-circuit">
      <div className="learning-loop">
        <RefreshCw aria-hidden="true" />
        {content.loop.map((item, index) => (
          <div className="learning-loop__anchor" key={item} style={{ '--i': index, '--total': content.loop.length }}>
            <Reveal beat={index + 1} className="learning-loop__node-reveal">
              <span><i>0{index + 1}</i><strong>{item}</strong></span>
            </Reveal>
          </div>
        ))}
      </div>
      <div className="lesson-notes">
        {content.lessons.map((lesson, index) => (
          <Reveal beat={index + 1} className="lesson-note-reveal" key={lesson.signal}>
            <div style={{ '--i': index }}><span>LECCIÓN 0{index + 1}</span><strong>{lesson.signal}</strong><FlowArrow /><small>{lesson.nextAction}</small></div>
          </Reveal>
        ))}
      </div>
      <Reveal beat={3} className="memory-circuit__prompts-reveal">
        <div className="memory-circuit__prompts">{content.prompts.map((prompt) => <span key={prompt}>{prompt}</span>)}</div>
      </Reveal>
      <Reveal beat={4} className="memory-circuit__rule-reveal">
        <p className="visual-mantra">{content.rule}</p>
      </Reveal>
    </div>
  )
}

function JourneyVisual({ content }) {
  const trackRef = useRef(null)
  const routeRef = useRef(null)
  const capsuleRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const route = routeRef.current
    const capsule = capsuleRef.current

    if (!track || !route || !capsule) return undefined

    const svg = route.ownerSVGElement
    const viewBox = svg?.viewBox?.baseVal
    const routeLength = route.getTotalLength()
    const motion = { progress: 0 }
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let motionFrame = 0
    let motionStartedAt = 0

    const placeCapsule = () => {
      if (!viewBox?.width || !viewBox?.height || !track.clientWidth || !track.clientHeight) return

      const point = route.getPointAtLength(routeLength * motion.progress)
      const x = ((point.x - viewBox.x) / viewBox.width) * track.clientWidth
      const y = ((point.y - viewBox.y) / viewBox.height) * track.clientHeight

      capsule.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const syncRouteMotion = () => {
      if (motionFrame) cancelAnimationFrame(motionFrame)
      motionFrame = 0
      motionStartedAt = 0
      motion.progress = 0
      placeCapsule()

      if (reducedMotionQuery.matches || document.hidden) return

      const animateRoute = (timestamp) => {
        if (!motionStartedAt) motionStartedAt = timestamp
        motion.progress = ((timestamp - motionStartedAt) % 7500) / 7500
        placeCapsule()
        motionFrame = requestAnimationFrame(animateRoute)
      }

      motionFrame = requestAnimationFrame(animateRoute)
    }

    const resizeObserver = typeof ResizeObserver === 'function'
      ? new ResizeObserver(placeCapsule)
      : null
    const handleResize = () => placeCapsule()

    resizeObserver?.observe(track)
    if (!resizeObserver) window.addEventListener('resize', handleResize)
    reducedMotionQuery.addEventListener?.('change', syncRouteMotion)
    document.addEventListener('visibilitychange', syncRouteMotion)
    syncRouteMotion()

    return () => {
      if (motionFrame) cancelAnimationFrame(motionFrame)
      resizeObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', handleResize)
      reducedMotionQuery.removeEventListener?.('change', syncRouteMotion)
      document.removeEventListener('visibilitychange', syncRouteMotion)
    }
  }, [])

  return (
    <div className="cyber-visual journey-stage requirement-odyssey">
      <Reveal beat={1} className="journey-requirement-reveal">
        <div className="journey-requirement">
          <GraduationCap aria-hidden="true" /><span>{content.requirement.id}</span><strong>{content.requirement.text}</strong>
        </div>
      </Reveal>
      <Reveal beat={1} className="journey-monitor-reveal">
        <div className="journey-monitor"><RadioTower aria-hidden="true" />{content.monitoring}</div>
      </Reveal>
      <div ref={trackRef} className="journey-track">
        <svg className="journey-track__rail" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
          <path ref={routeRef} d="M40 185 C155 60 250 310 365 185 S575 60 690 185 S900 310 1160 185" data-flow-line="path" data-flow-beat="1" />
          <path className="journey-track__echo" d="M40 205 C155 80 250 330 365 205 S575 80 690 205 S900 330 1160 205" data-flow-line="path" data-flow-beat="1" />
        </svg>
        <div
          ref={capsuleRef}
          className="journey-capsule"
          style={{ top: 0, left: 0, zIndex: 10, opacity: 1, animation: 'none', pointerEvents: 'none', willChange: 'transform' }}
        >
          <div className="journey-capsule__signal-reveal">
            <div className="journey-capsule__signal"><RadioTower aria-hidden="true" /><strong>{content.requirement.id}</strong></div>
          </div>
        </div>
        {content.stages.map((stage, index) => {
          const Icon = journeyIcons[index]
          const state = stage.stage === 'EJECUTAR'
            ? ' is-failure'
            : stage.stage === 'CORREGIR'
              ? ' is-recovery'
              : stage.stage === 'CERRAR'
                ? ' is-archive'
                : ''
          const beat = index < 2 ? 1 : index < 4 ? 2 : index < 6 ? 3 : 4
          return (
            <div className="journey-station-anchor" key={stage.stage} style={{ '--i': index, '--total': content.stages.length }}>
              <Reveal beat={beat} className="journey-station-reveal">
                <div className={'journey-station' + state}>
                  <i>0{index + 1}</i>
                  <Icon aria-hidden="true" />
                  <strong>{stage.stage}</strong>
                  <span>{stage.output}</span>
                </div>
              </Reveal>
            </div>
          )
        })}
        <div className="journey-track__fault-rift" />
        <div className="journey-track__recovery-pulse" />
      </div>
      <Reveal beat={4} className="journey-lesson-reveal">
        <div className="journey-lesson"><Sparkles aria-hidden="true" /><span>LECCIÓN CONSERVADA</span><strong>{content.lesson}</strong></div>
      </Reveal>
    </div>
  )
}

function FiveIdeasVisual({ content }) {
  return (
    <div className="cyber-visual five-stage memory-collapse">
      <div className="memory-collapse__vanishing-grid" />
      <div className="idea-giants">
        {content.ideas.map((idea, index) => (
          <div className="idea-giant-anchor" key={idea.number} style={{ '--i': index, '--total': content.ideas.length }}>
            <Reveal beat={Math.min(index + 1, 4)} className="idea-giant-reveal">
              <section className="idea-giant" data-idea={idea.number}>
                <span>{idea.number}</span>
                <strong>{idea.title}</strong>
                <p>{idea.text}</p>
              </section>
            </Reveal>
          </div>
        ))}
      </div>
      <div className="memory-collapse__lines">
        {content.ideas.map((idea, index) => <i key={idea.number} style={{ '--i': index }} />)}
      </div>
      <div className="memory-collapse__core">
        <Reveal beat={4} className="memory-collapse__core-reveal">
          <div><ScanSearch aria-hidden="true" /><strong>EVIDENCIA</strong><span>DECISIÓN</span></div>
        </Reveal>
      </div>
      <Reveal beat={4} className="process-spine-reveal">
        <div className="process-spine">
          {content.process.map((item, index) => <span key={item}><i>{index + 1}</i>{item}</span>)}
        </div>
      </Reveal>
      <Reveal beat={4} className="cross-cutting-reveal">
        <div className="cross-cutting">{content.crossCutting.map((item) => <NeonTag tone="magenta" key={item}>{item}</NeonTag>)}</div>
        <p className="visual-mantra">{content.finalThought}</p>
      </Reveal>
    </div>
  )
}

export function CyberVisual({ slide }) {
  const { kind, content } = slide
  switch (kind) {
    case 'cover': return <CoverVisual />
    case 'team': return <TeamVisual content={content} />
    case 'thesis': return <ThesisVisual content={content} />
    case 'model-map': return <ModelMapVisual content={content} />
    case 'question-grid': return <QuestionGridVisual content={content} />
    case 'plan-table': return <PlanTableVisual content={content} />
    case 'risk-matrix': return <RiskMatrixVisual content={content} />
    case 'monitor-control': return <MonitorControlVisual content={content} />
    case 'output-pipeline': return <OutputPipelineVisual content={content} />
    case 'case-plan': return <CasePlanVisual content={content} />
    case 'split-question': return <SplitQuestionVisual content={content} />
    case 'source-funnel': return <SourceFunnelVisual content={content} />
    case 'condition-tree': return <ConditionTreeVisual content={content} />
    case 'priority-queue': return <PriorityQueueVisual content={content} />
    case 'case-matrix': return <CaseMatrixVisual content={content} />
    case 'dependency-orbit': return <DependencyOrbitVisual content={content} />
    case 'trace-chain': return <TraceChainVisual content={content} />
    case 'anti-patterns': return <AntiPatternsVisual content={content} />
    case 'prepare-run': return <PrepareRunVisual content={content} />
    case 'executable-card': return <ExecutableCardVisual content={content} />
    case 'environment-stack': return <EnvironmentVisual content={content} />
    case 'execution-sequence': return <ExecutionSequenceVisual content={content} />
    case 'result-decision': return <ResultDecisionVisual content={content} />
    case 'causality-chain': return <CausalityVisual content={content} />
    case 'fix-cycle': return <FixCycleVisual content={content} />
    case 'manual-automation': return <ManualAutomationVisual content={content} />
    case 'evaluation-gate': return <EvaluationGateVisual content={content} />
    case 'exit-checklist': return <ExitChecklistVisual content={content} />
    case 'metrics-dashboard': return <MetricsVisual content={content} />
    case 'executive-report': return <ReportVisual content={content} />
    case 'closure-flow': return <ClosureVisual content={content} />
    case 'learning-loop': return <LearningLoopVisual content={content} />
    case 'end-to-end-journey': return <JourneyVisual content={content} />
    case 'five-ideas': return <FiveIdeasVisual content={content} />
    case 'closing': return <CoverVisual closing />
    default: return <div className="cyber-visual" data-unsupported-visual={kind ?? 'missing'}><ScanSearch aria-hidden="true" /></div>
  }
}
