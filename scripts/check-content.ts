import { activityPlan, facts, figures, images, mapLocations, questions, sources, theses, timelineEvents, videos, sections } from '../src/data/content';
import { validateContent } from '../src/lib/validate-content';
const errors = validateContent({ facts, figures, images, mapLocations, questions, theses, timelineEvents, videos }, sources);
if (theses.length !== 10 || facts.length !== 30 || figures.filter(p=>p.role==='hero').length < 11) errors.push('Topic 8 needs 10 published theses, 30 distinct facts and at least 11 wartime profiles');
if (new Set(activityPlan.map(a => a.id)).size !== 5) errors.push('Expected 5 distinct planned activity types');
if (new Set(sections.map(s => s.id)).size !== 11) errors.push('Expected 11 sections');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Content references and structure OK. Sourced learning entries are not academically verified or assessment completion.');
