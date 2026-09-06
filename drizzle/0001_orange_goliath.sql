CREATE TABLE `datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`versionLabel` varchar(80) NOT NULL,
	`description` text,
	`caseCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`testCaseId` int NOT NULL,
	`output` text NOT NULL,
	`passed` int NOT NULL DEFAULT 0,
	`scoreJson` text NOT NULL,
	`latencyMs` int NOT NULL DEFAULT 0,
	`estimatedTokens` int NOT NULL DEFAULT 0,
	`estimatedCostCents` int NOT NULL DEFAULT 0,
	`failureReason` text,
	CONSTRAINT `evaluation_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`workflowVersionId` int NOT NULL,
	`datasetId` int NOT NULL,
	`scorecardId` int NOT NULL,
	`status` enum('running','completed','blocked','failed') NOT NULL DEFAULT 'completed',
	`passedCases` int NOT NULL DEFAULT 0,
	`totalCases` int NOT NULL DEFAULT 0,
	`taskSuccess` int NOT NULL DEFAULT 0,
	`groundedness` int NOT NULL DEFAULT 0,
	`refusalBehavior` int NOT NULL DEFAULT 0,
	`toolFormat` int NOT NULL DEFAULT 0,
	`injectionResistance` int NOT NULL DEFAULT 0,
	`medianLatencyMs` int NOT NULL DEFAULT 0,
	`estimatedTokens` int NOT NULL DEFAULT 0,
	`estimatedCostCents` int NOT NULL DEFAULT 0,
	`releaseDecision` varchar(40) NOT NULL DEFAULT 'passed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluation_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `release_gates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`metric` varchar(80) NOT NULL,
	`operator` varchar(8) NOT NULL DEFAULT '>=',
	`threshold` int NOT NULL,
	`critical` int NOT NULL DEFAULT 1,
	CONSTRAINT `release_gates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`runId` int NOT NULL,
	`resultId` int NOT NULL,
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`reason` text NOT NULL,
	`decision` enum('pending','approve','reject','needs_edit') NOT NULL DEFAULT 'pending',
	`reviewerNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	CONSTRAINT `review_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scorecards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`rulesJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scorecards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `test_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`externalId` varchar(120) NOT NULL,
	`category` varchar(100) NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL,
	`input` text NOT NULL,
	`expectedOutcome` text NOT NULL,
	`safetyCase` int NOT NULL DEFAULT 0,
	`adversarial` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `test_cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`versionLabel` varchar(80) NOT NULL,
	`model` varchar(160) NOT NULL,
	`prompt` text NOT NULL,
	`notes` text,
	`isBaseline` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workflow_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(200) NOT NULL,
	`taskType` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`expectedBehavior` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`),
	CONSTRAINT `workflows_slug_unique` UNIQUE(`slug`)
);
