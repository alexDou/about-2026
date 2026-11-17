# Cloud & DevOps questionnaire

The Cloud & DevOps Skill group, observability included. The Owner's answers are kept verbatim; the polished text lives in the message file once approved.

**CV seed**: "Docker, Kubernetes, AWS, Terraform, Jenkins, GitLab, Nginx and Apache. Maintenance of CI/CD pipelines."; "monitoring, profiling and observation (Prometheus, Grafana, Instana, GTM, CloudWatch)"; New Relic (Roles). Certificates: Educative "Docker for Developers" (Jun 2025), Udemy "BASH Programming Course: Master the Linux Command Line!" (Jul 2019).

## Round 1

1. The list: add, drop, merge? Candidates: GitHub Actions, Google Cloud, Linux, Docker Compose, Helm, Sentry. GTM here, or in Frontend's Performance or SEO?
2. Confidence per Skill; which to merge?
3. Subgroups: A (Skills plus "Observability") or B (subgroups only)?
4. AWS: one Skill naming its services; which?
5. Bash: a Skill of its own, or "Linux & Bash"?

### Answers

> Nginx and Apache are servers. ok, lets add them together and mention somewhere. on VPS or in a cloud. configuration, plugins, load balancing etc
>
> Google Cloud, Bash/Zsh, IPtables, Docker Compose, Helm
>
> Docker, Docker Compose - confident, dockerfile optimisation best practices
> Kubernetes - application level; mostly a user of smt already running
> Terraform, Helm - application level; can manage, amend configs,
> Gitlab, Jenkins - confident. prod level experience. deploy, jobs config, caching
> Prometheus, Grafana, Instana, GTM, CloudWatch, GTM - use regularily (omit new relic)

3. ok, A
4. oh there are so many. deployed a lot on AWS. AIM, EC2, S3, ELB, Route53, RDS/Dynamo - always. others - depends
5. i dont want too many groups. list Bash in Linux

## Round 2

1. Google Cloud: confidence, services?
2. Nginx & Apache: a depth word; "modules" for "plugins"?
3. Linux: confidence; "Linux" or "Linux: Bash, Zsh & iptables"?
4. The five observability tools: five Skills, or one ("Monitoring & analytics")?
5. The rest approved?

### Answers

> skip iptables

1. we will deply to GC. so, put in here smt that we are going to use + ADK
2. yes, modules. the line you have there is ok
3. we are on Linux now. confident enough. Debian, Ubuntu, OpenSuse
4. in one line evrything, yes. "Monitoring & Observability" is better. go for it
5. ok

## Round 3

Google Cloud ("Cloud Run, Firestore and Cloud Storage, with ADK for the agent: the stack this site runs on.") and Linux to approve; Monitoring & Observability as one Skill in the group, no subgroup.

### Answers

> ok
> Confident: my everyday system. Either Debian based distro or openSUSE. Bash scripting.
> or Bash/Zsh scripting - not sure. i normally create bash, but these days everybodys on zsh
> no dont add zsh then

Approved: the text is in `frontend/src/i18n/en/skills.json`.
