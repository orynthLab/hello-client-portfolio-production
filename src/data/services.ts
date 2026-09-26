export type ServiceSection = {
  heading: string;
  body: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  name: string;
  seoTitle: string;
  eyebrow: string;
  tagline: string;
  description: string;
  accent: string;
  sections: ServiceSection[];
  faqs: ServiceFaq[];
  relatedProjectSlugs: string[];
  relatedServiceSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "ai-agent-development",
    name: "AI Agent Development",
    seoTitle: "AI Agent Development Services",
    eyebrow: "AI Agents",
    tagline:
      "Custom AI agent development for real decisions — connected to business tools, bounded by clear permissions, and reviewed by people when it matters.",
    description:
      "AI agent development for business workflows: OrynthBuild connects models to your tools and data, with human review where decisions need it.",
    accent: "#52f2ff",
    sections: [
      {
        heading: "What is an AI agent?",
        body: "An AI agent uses a model to interpret a request, choose from approved actions, and work with tools or information sources to complete a task. Unlike a fixed script, it can handle variation; unlike an open-ended chatbot, a production agent has defined permissions, boundaries, and a clear handoff when it should not act.",
      },
      {
        heading: "Agents built around the work",
        body: "Our AI agent development services include tool-using agents for research, document review, analysis, and drafting. For business knowledge work, retrieval-augmented generation (RAG) can find relevant passages from approved organizational documents and ground responses in that material. Multi-agent systems can split a larger workflow into specialist steps, with explicit handoffs and checks between them; autonomous actions should stay within a defined scope.",
      },
      {
        heading: "Connect agents to business tools",
        body: "AI agent integrations can connect approved APIs, databases, and existing software so an agent can retrieve context or prepare an action. Access should be limited to the tools and data the workflow needs; actions such as sending an email, changing a record, or proposing a financial decision can be held for human approval.",
      },
      {
        heading: "Human review and security for enterprise AI agents",
        body: "A useful agent needs a defined scope, protected credentials, permission checks, and records of the inputs and actions that matter. Enterprise AI agents should also be evaluated against the organization’s access, data handling, and audit requirements. We plan for uncertainty and exceptions, set confidence or policy checks where appropriate, and route consequential decisions to a person instead of treating model output as automatically trusted.",
      },
      {
        heading: "From use case to deployed agent",
        body: "AI agent development starts with a specific task and a baseline for success. We map the people, data, and systems involved; select an agent pattern; build a narrow working flow; test expected cases and failure paths; then integrate, review, and refine it against real use. The right first use case may be a single agent rather than a multi-agent system.",
      },
      {
        heading: "Practical business use cases",
        body: "Research assistants can gather and cite information, document agents can extract fields and flag inconsistencies, and business-development agents can research prospects and draft outreach for review. Existing OrynthBuild work includes a financial-report workspace, a document-verification system, and a supervised business-development pipeline; each page describes its own scope and implementation.",
      },
    ],
    faqs: [
      {
        question: "How is an AI agent different from a chatbot?",
        answer:
          "A chatbot mainly responds in conversation. An AI agent can also use approved tools, retrieve information, and complete defined workflow steps. Its permissions and human handoffs should be designed around the task.",
      },
      {
        question: "What should I look for in an AI agent development company?",
        answer:
          "Look for a team that can define the task and boundaries, explain how the agent uses data and tools, test failure cases, and set up human review for consequential actions. The right design depends on the workflow, not just the model.",
      },
      {
        question: "Can an AI agent use our internal documents?",
        answer:
          "Yes, when the use case and data access allow it. Retrieval-augmented generation can find relevant passages from an approved knowledge source and provide that context to the agent. Access controls and source quality still matter.",
      },
      {
        question: "When should we use a multi-agent system?",
        answer:
          "Use multiple agents when a workflow has distinct tasks that benefit from separate roles and checks. For a narrow task, one well-scoped agent is often simpler to test, operate, and maintain.",
      },
      {
        question: "Can people approve an agent’s actions before they happen?",
        answer:
          "Yes. The workflow can pause for review before consequential actions, such as sending a message or changing a business record, and can route uncertain cases to a person.",
      },
    ],
    relatedProjectSlugs: [
      "investment-advisory-agent",
      "document-identifier-verifier",
      "autonomous-business-development-agent",
    ],
    relatedServiceSlugs: ["workflow-automation", "full-stack-development"],
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    seoTitle: "MVP Development Services",
    eyebrow: "MVP Development",
    tagline:
      "MVP development for founders who need a working product to test with real users before expanding the scope.",
    description:
      "MVP development services for founders and startups: define the smallest useful product, build it end to end, and prepare it for real user feedback.",
    accent: "#4ee6a8",
    sections: [
      {
        heading: "Start with product discovery",
        body: "Startup MVP development begins by clarifying who the product is for, what problem it solves, and which assumption needs to be tested first. We use those answers to define a focused scope, identify dependencies, and agree on what a useful first release should let a real user do.",
      },
      {
        heading: "Move from prototype to MVP to launch",
        body: "A prototype can help explore an interaction or validate an idea; an MVP is a usable product with the core path working. We plan a sequence from early proof to a release, so the team can learn from users before expanding into features that have not yet been validated.",
      },
      {
        heading: "Build the right kind of first product",
        body: "A SaaS MVP may be a web product, mobile experience, or business dashboard, depending on where users need to do the work. AI MVP development and broader AI product development can include a model-powered feature when it tests the product’s core value, with suitable review and fallback paths. AI software development should also account for model limits, data access, and a usable fallback.",
      },
      {
        heading: "Make the core workflow usable",
        body: "The first release may need user accounts, roles, payments, third-party integrations, or an admin area—but only when they support the validation goal. We connect the frontend, backend, data, and required services into a working product rather than a visual prototype that cannot support real use.",
      },
      {
        heading: "Learn, then scale deliberately",
        body: "After launch, feedback and usage help decide what to improve next. Product engineering continues with the architecture and operational work justified by real demand, keeping room to extend the MVP without assuming every early feature needs enterprise-scale infrastructure.",
      },
    ],
    faqs: [
      {
        question: "What is included in MVP development?",
        answer:
          "Scope depends on the product, but commonly includes discovery, a prioritized feature set, interface and application development, required data or service integrations, testing, and preparation for release.",
      },
      {
        question: "How do I choose an MVP development company?",
        answer:
          "Choose a team that can help define the user problem and testable scope, deliver the core workflow as usable software, and explain the decisions that affect later changes. Agree on ownership, milestones, and release responsibilities before work begins.",
      },
      {
        question: "How is an MVP different from a prototype?",
        answer:
          "A prototype helps explore an idea or interaction. An MVP is a working product that supports its core user task and can be put in front of real users to learn from their response.",
      },
      {
        question: "Can you build an AI or SaaS MVP?",
        answer:
          "Yes. An AI feature or SaaS workflow can be part of an MVP when it is central to the product hypothesis. The initial scope should include only the model, accounts, integrations, and operational pieces needed to test that hypothesis responsibly.",
      },
      {
        question: "What happens after the MVP launches?",
        answer:
          "The next stage should follow what users need and what the product team learns. That may mean refining the core workflow, adding validated features, or strengthening performance and operations as usage grows.",
      },
    ],
    relatedProjectSlugs: ["autonomous-business-development-agent", "igc-logistics-platform"],
    relatedServiceSlugs: ["full-stack-development", "ai-agent-development"],
  },
  {
    slug: "workflow-automation",
    name: "AI Workflow Automation",
    seoTitle: "AI Workflow Automation Services",
    eyebrow: "Automation",
    tagline:
      "AI workflow automation for repetitive business processes, with clear approval steps and exception handling when work does not follow the happy path.",
    description:
      "AI workflow automation services connect business processes, documents, and existing software while keeping review and exception paths clear.",
    accent: "#f3d38a",
    sections: [
      {
        heading: "AI automation and traditional automation",
        body: "Traditional automation is effective when steps and inputs are predictable: a trigger can call an API, update a database, or route a task by fixed rules. Intelligent workflow automation adds model-based interpretation for less-structured work, such as classifying a document or drafting a response. Many useful business process automation systems combine both and keep rules around the model’s output.",
      },
      {
        heading: "Choose processes that benefit from automation",
        body: "Good candidates for AI business automation have repeated steps, clear inputs and outcomes, and enough volume to justify implementation. Examples include document intake, data entry and reconciliation, routing requests, preparing reports, and coordinating approvals. Enterprise workflow automation should reflect the actual process owners, access rules, and exception paths. Processes with unclear ownership or frequent judgment calls may need redesign before they should be automated.",
      },
      {
        heading: "Connect AI, APIs, data, and existing software",
        body: "An automated business process can use APIs to move approved data between existing applications, databases to maintain workflow state, and AI to interpret text or documents where fixed rules are insufficient. Integration scope depends on the systems’ available interfaces, data quality, and access policies.",
      },
      {
        heading: "AI document automation with review paths",
        body: "Intelligent document processing can classify incoming files, extract requested fields, and flag missing or inconsistent information. Confidence checks and human review help prevent uncertain extractions from silently changing downstream records. The same pattern can support invoice, identity, or other document workflows when the use case permits.",
      },
      {
        heading: "Approvals, exceptions, and monitoring",
        body: "Reliable automation accounts for cases that do not match the expected path. Define who reviews exceptions, what can be retried safely, and how failures are surfaced. Logs, alerts, and operational dashboards can help teams understand completed work and investigate errors without removing necessary human control.",
      },
      {
        heading: "Implement and improve the workflow",
        body: "We map the current process and systems, select a contained workflow, define rules and review points, connect the required tools, and test normal and exception cases. After release, monitoring and feedback inform adjustments. Existing logistics and document-intelligence projects illustrate two different automation patterns.",
      },
    ],
    faqs: [
      {
        question: "What is AI workflow automation?",
        answer:
          "It combines workflow rules and software integrations with AI for tasks that involve less-structured information, such as understanding documents or preparing drafts. People can remain part of approvals and exceptions.",
      },
      {
        question: "Do you provide AI automation services for existing business processes?",
        answer:
          "Yes. AI automation services can connect a model to an existing workflow when interpretation of text or documents adds value. We first review the process, available system interfaces, data access, approval needs, and exceptions to define a suitable scope.",
      },
      {
        question: "Which business processes are good candidates?",
        answer:
          "Repeated processes with identifiable inputs, outcomes, and exception owners are often good candidates. Document intake, request routing, report preparation, and data movement between systems are examples to assess—not automatic recommendations for every organization.",
      },
      {
        question: "Can automation work with our existing software?",
        answer:
          "Often, if the software provides a suitable API or integration method and the required access is available. The design should account for data formats, permissions, rate limits, and what happens when a connected system is unavailable.",
      },
      {
        question: "How are errors and exceptions handled?",
        answer:
          "The workflow should define which failures can be retried, which cases need human review, and how teams are notified. Logging and monitoring make it easier to trace what happened and improve the process safely.",
      },
    ],
    relatedProjectSlugs: ["igc-logistics-platform", "document-identifier-verifier", "company-financial-report-agent"],
    relatedServiceSlugs: ["ai-agent-development", "full-stack-development"],
  },
  {
    slug: "full-stack-development",
    name: "Full Stack Development Services",
    seoTitle: "Full Stack Development Services",
    eyebrow: "Full-Stack Development",
    tagline:
      "Full stack development services for web applications and business software, from interface and APIs through data, integrations, and deployment.",
    description:
      "Custom full stack development services for web applications and business software, from interface and APIs to data, integrations, and deployment.",
    accent: "#3b82f6",
    sections: [
      {
        heading: "Frontend, backend, data, and APIs",
        body: "Custom web application development joins the interface people use to the backend rules, database, and APIs that support it. Full stack development plans those pieces together, including how information is validated, stored, retrieved, and exchanged with other services.",
      },
      {
        heading: "SaaS platforms and business applications",
        body: "Custom software may include a SaaS product, an internal operations tool, a reporting dashboard, or a customer-facing portal. The right architecture depends on the users, workflows, data, and service requirements rather than a generic feature checklist.",
      },
      {
        heading: "Access, integrations, and security",
        body: "Applications can use authentication to identify users and authorization to control what each role can do. Third-party integrations should be scoped to the information and actions required, with credentials protected and failures handled without exposing sensitive data.",
      },
      {
        heading: "Deployment, performance, and growth",
        body: "Cloud deployment and hosting choices depend on the product’s operational needs. We consider how the application will be monitored, how common tasks perform, and what parts may need to scale as usage grows. Enterprise software development also benefits from clear environments, access rules, and release processes.",
      },
      {
        heading: "Maintain and iterate after launch",
        body: "A useful application needs a path for fixes and improvement after its first release. We build around the agreed requirements, test key workflows, and leave a structure that can be extended as priorities change. OrynthBuild project examples include a financial-intelligence workspace and a logistics operations platform.",
      },
    ],
    faqs: [
      {
        question: "What does full stack development include?",
        answer:
          "It can include the frontend, backend services, data storage, APIs, integrations, testing, and deployment for a web or application product. The exact scope follows the product’s requirements.",
      },
      {
        question: "What should I look for in a full stack development company?",
        answer:
          "Look for a team that can explain the frontend, backend, data, integration, security, and deployment choices for your requirements—and how the application will be tested and maintained after release.",
      },
      {
        question: "Can you build custom business software or SaaS?",
        answer:
          "Yes. The architecture and scope are shaped around the users, workflows, data, integrations, and operating requirements of the business or SaaS product.",
      },
      {
        question: "How do you handle authentication and permissions?",
        answer:
          "The design distinguishes identifying a user from authorizing their actions. Roles and access rules should reflect the application’s real workflows, and should be tested on the paths that handle sensitive data or operations.",
      },
      {
        question: "Can an application be extended after launch?",
        answer:
          "Yes. We plan the initial architecture around the known requirements and likely changes, then use actual usage and product priorities to guide future scaling and features.",
      },
    ],
    relatedProjectSlugs: ["company-financial-report-agent", "igc-logistics-platform", "investment-advisory-agent"],
    relatedServiceSlugs: ["mvp-development", "workflow-automation"],
  },
  {
    slug: "white-label-execution",
    name: "White Label Software Development",
    seoTitle: "White Label Software Development",
    eyebrow: "White-Label Partner",
    tagline:
      "White label software development for agencies that need engineering capacity behind their own client relationships and brand.",
    description:
      "White label software development for agencies that need an engineering partner for web products, AI features, and workflow automation under their brand.",
    accent: "#9b6bff",
    sections: [
      {
        heading: "How white-label engineering works",
        body: "The agency owns the client relationship and shares the agreed scope and delivery context with OrynthBuild. We handle the engineering work through the agreed communication channel; the agency reviews progress and presents the work to its client under its own brand. Roles, client contact, and delivery responsibilities should be clear before the project starts.",
      },
      {
        heading: "Agree on scope, communication, and ownership",
        body: "Before work begins, define milestones, who makes product decisions, how updates and questions flow, and who approves changes. Confidentiality terms, repository access, code ownership, and handover expectations should be agreed in writing for each engagement rather than assumed to be identical across projects.",
      },
      {
        heading: "Quality checks and delivery",
        body: "A workable delivery plan includes review against acceptance criteria, testing of the agreed user flows, a place to report defects, and clear release responsibilities. Deployment access and production approval should stay with the parties designated in the project agreement.",
      },
      {
        heading: "Engineering across web, AI, and automation",
        body: "An agency engineering partner can support full-stack product work, MVPs, white-label AI development, and workflow automation. The project can be scoped as a defined build or a flexible extension of the agency’s delivery capacity, with responsibilities and availability agreed up front.",
      },
      {
        heading: "A delivery partner, not an undefined handoff",
        body: "White-label development is a delivery arrangement: the agency remains the client-facing provider while the engineering partner works behind the scenes. Like any outsourced software development, it needs a clear scope and accountable owners; the white-label model adds explicit expectations around confidentiality, branding, and communication.",
      },
    ],
    faqs: [
      {
        question: "How does a white-label development engagement work?",
        answer:
          "The agency manages its client relationship and agrees on the scope and delivery process with the engineering partner. The partner builds to that scope, shares progress through the agreed channel, and the agency presents the work under its own brand.",
      },
      {
        question: "How do I evaluate a white-label development company?",
        answer:
          "Discuss relevant technical experience, delivery roles, communication cadence, QA expectations, confidentiality terms, repository access, code ownership, and handover. These details should be agreed for the specific engagement.",
      },
      {
        question: "Are NDAs and code ownership included by default?",
        answer:
          "Confidentiality terms, repository access, code ownership, and handover should be agreed in writing for each engagement. They depend on the parties’ contract and should not be assumed from the white-label model alone.",
      },
      {
        question: "Can an agency use white-label AI development?",
        answer:
          "Yes. The engineering scope can include AI agents or workflow automation when they fit the client project. Data access, integrations, review requirements, and delivery responsibilities should be agreed before implementation.",
      },
      {
        question: "How is white-label development different from generic outsourcing?",
        answer:
          "White-label delivery explicitly keeps the agency as the client-facing provider and defines how the engineering partner works behind its brand. It still requires the same clear scope, communication, quality checks, and ownership agreements as any outsourced development project.",
      },
    ],
    relatedProjectSlugs: ["autonomous-business-development-agent", "igc-logistics-platform"],
    relatedServiceSlugs: ["ai-agent-development", "mvp-development", "full-stack-development"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
