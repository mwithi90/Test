# CLAUDE.md - AI Assistant Guide

**Last Updated:** 2026-01-18
**Repository:** mwithi90/Test
**Status:** New Repository (No content yet)

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Code Conventions](#code-conventions)
5. [Testing Guidelines](#testing-guidelines)
6. [Build & Deployment](#build--deployment)
7. [Git Workflow](#git-workflow)
8. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Repository Overview

### Current State
This is a newly initialized repository with no content yet. This document serves as a living guide that should be updated as the codebase evolves.

### Purpose
**TODO:** Document the purpose and goals of this project once established.

### Tech Stack
**TODO:** List the primary technologies, frameworks, and tools used:
- Programming Language(s):
- Framework(s):
- Database(s):
- Build Tools:
- Testing Framework(s):

---

## Codebase Structure

### Directory Layout
**TODO:** Document the directory structure as the project grows:

```
/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── scripts/          # Build/utility scripts
├── config/           # Configuration files
└── ...
```

### Key Files
**TODO:** Document important files and their purposes:
- **Configuration Files:** package.json, Makefile, docker-compose.yml, etc.
- **Entry Points:** Main application entry points
- **Documentation:** README.md, API docs, etc.

### Module Organization
**TODO:** Explain how code is organized into modules/packages:
- Core modules
- Utility modules
- External dependencies

---

## Development Workflow

### Getting Started
**TODO:** Document setup steps:

```bash
# 1. Clone the repository
git clone <repository-url>
cd Test

# 2. Install dependencies
# [Add commands here]

# 3. Set up environment
# [Add commands here]

# 4. Run the application
# [Add commands here]
```

### Development Environment
**TODO:** Document required tools and versions:
- **Required Software:** Node.js, Python, Docker, etc.
- **IDE Recommendations:** VSCode extensions, linter configurations
- **Environment Variables:** List required env vars and where to configure them

### Common Development Tasks
**TODO:** Document frequently used commands:

```bash
# Run in development mode
# [command]

# Run tests
# [command]

# Build for production
# [command]

# Lint code
# [command]

# Format code
# [command]
```

---

## Code Conventions

### Style Guide
**TODO:** Document coding standards and conventions:

#### File Naming
- **Source Files:** camelCase, PascalCase, snake_case, etc.
- **Test Files:** *.test.js, *_test.py, etc.
- **Configuration Files:** Follow framework conventions

#### Code Style
- **Indentation:** Spaces or tabs, how many
- **Line Length:** Maximum characters per line
- **Naming Conventions:**
  - Variables: camelCase, snake_case, etc.
  - Functions/Methods: camelCase, snake_case, etc.
  - Classes: PascalCase
  - Constants: UPPER_SNAKE_CASE
  - Private members: _prefixed or specific pattern

#### Comments and Documentation
- Use clear, descriptive comments for complex logic
- Document public APIs and interfaces
- Keep comments up-to-date with code changes
- **TODO:** Specify documentation tool (JSDoc, Sphinx, etc.)

### Architecture Patterns
**TODO:** Document architectural decisions:
- Design patterns used
- State management approach
- API design conventions
- Error handling patterns
- Logging conventions

### Dependencies
**TODO:** Guidelines for adding dependencies:
- Prefer well-maintained, popular libraries
- Check licenses before adding
- Document why each major dependency is needed
- Keep dependencies up-to-date

---

## Testing Guidelines

### Test Structure
**TODO:** Document testing approach:
- **Unit Tests:** Test individual functions/methods
- **Integration Tests:** Test component interactions
- **E2E Tests:** Test full user workflows
- **Test Coverage Goals:** Minimum coverage percentage

### Writing Tests
**TODO:** Testing conventions:

```bash
# Run all tests
# [command]

# Run specific test suite
# [command]

# Run with coverage
# [command]

# Run in watch mode
# [command]
```

### Testing Best Practices
- Write tests for all new features
- Update tests when modifying existing code
- Test edge cases and error conditions
- Keep tests fast and focused
- Use meaningful test descriptions

---

## Build & Deployment

### Build Process
**TODO:** Document build steps:

```bash
# Development build
# [command]

# Production build
# [command]

# Clean build artifacts
# [command]
```

### Deployment
**TODO:** Document deployment process:
- **Environments:** development, staging, production
- **CI/CD Pipeline:** Description of automated workflows
- **Manual Deployment Steps:** If applicable
- **Rollback Procedure:** How to revert a deployment

### Environment Configuration
**TODO:** Document environment-specific settings:
- Development environment setup
- Production environment requirements
- Environment variables needed per environment

---

## Git Workflow

### Branch Strategy
This repository follows a feature branch workflow:

- **Main Branch:** `main` or `master` (production-ready code)
- **Feature Branches:** `claude/claude-md-<session-id>` for AI-assisted development
- **Other Branches:** Document any other branch conventions

### Commit Conventions
Follow these commit message guidelines:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples:**
```bash
feat: add user authentication module

fix: resolve null pointer exception in data processor

docs: update README with installation instructions
```

### Pull Request Process
**TODO:** Document PR workflow:
1. Create feature branch from main
2. Make changes and commit
3. Push branch to remote
4. Create pull request
5. Request review (if applicable)
6. Address feedback
7. Merge when approved

### Code Review Guidelines
**TODO:** Document code review expectations:
- What reviewers should look for
- How to provide constructive feedback
- When to approve vs. request changes

---

## Important Notes for AI Assistants

### Before Making Changes

1. **Always Read First:** Never propose changes to code you haven't read. Use the Read tool to examine files before suggesting modifications.

2. **Understand Context:** Review related files and dependencies to understand how changes might impact the system.

3. **Check Existing Patterns:** Look for existing implementations of similar functionality to maintain consistency.

### Development Best Practices

1. **Minimal Changes:** Only make changes that are directly requested or clearly necessary. Avoid over-engineering.

2. **Security First:** Watch for security vulnerabilities:
   - SQL injection
   - XSS (Cross-Site Scripting)
   - Command injection
   - Insecure dependencies
   - Hardcoded secrets

3. **No Unnecessary Additions:**
   - Don't add error handling for scenarios that can't happen
   - Don't create abstractions for one-time operations
   - Don't add features beyond what was requested
   - Don't refactor unrelated code
   - Don't add comments to code you didn't change

4. **Test Your Changes:** After making changes, run tests to ensure nothing broke.

### Git Operations

1. **Branch Management:**
   - Always develop on the designated feature branch
   - Branch must start with `claude/` and end with the session ID
   - Never push to main/master without permission

2. **Committing:**
   - Create commits only when requested by the user
   - Write clear, descriptive commit messages
   - Follow commit message conventions
   - Never skip hooks unless explicitly requested
   - Avoid `git commit --amend` unless explicitly requested

3. **Pushing:**
   - Always use `git push -u origin <branch-name>`
   - Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) if network errors occur
   - Push will fail with 403 if branch name doesn't match required format

### Tool Usage

1. **Use Specialized Tools:**
   - Read tool for reading files (not cat/head/tail)
   - Edit tool for editing files (not sed/awk)
   - Write tool for creating files (not echo/heredoc)
   - Grep tool for searching content (not grep/rg commands)
   - Glob tool for finding files (not find/ls)

2. **Parallel Execution:**
   - Make independent tool calls in parallel when possible
   - Sequential calls only when dependencies exist

3. **Task Management:**
   - Use TodoWrite tool for multi-step tasks
   - Update task status in real-time
   - Mark tasks complete immediately after finishing
   - Only one task should be in_progress at a time

### Communication

1. **Be Concise:** Responses should be short and focused
2. **No Emojis:** Unless explicitly requested by the user
3. **Output Text Directly:** Never use echo or command-line tools to communicate with users
4. **Code References:** Include `file_path:line_number` when referencing specific code

### When to Ask Questions

Use the AskUserQuestion tool when you need to:
- Clarify ambiguous requirements
- Choose between multiple valid approaches
- Get decisions on implementation choices
- Validate assumptions

### Updating This Document

This CLAUDE.md file should be kept up-to-date as the project evolves:
- Update the "Last Updated" date when making changes
- Add new sections as patterns emerge
- Document decisions and rationale
- Keep examples relevant and accurate
- Remove TODO sections once they're filled in

---

## Quick Reference

### Essential Commands
**TODO:** Add commonly used commands as they're established:

```bash
# Setup
# [commands]

# Development
# [commands]

# Testing
# [commands]

# Building
# [commands]

# Deployment
# [commands]
```

### Important Paths
**TODO:** Document key file/directory paths:
- Configuration files
- Entry points
- Test directories
- Build output

### Useful Resources
**TODO:** Add links to:
- Official documentation
- Architecture decision records (ADRs)
- API documentation
- Style guides
- External tools/services

---

## Changelog

### 2026-01-18
- Initial CLAUDE.md creation
- Established template structure
- Added AI assistant guidelines

---

**Note:** This is a living document. Please update it as the codebase evolves to help future developers and AI assistants understand the project better.
