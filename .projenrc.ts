import { awscdk, javascript } from 'projen';
import { ArrowParens, TrailingComma } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'rehanvdm',
  authorAddress: 'rehan.vdm4+github-tailscale-lambda-extension@gmail.com',
  cdkVersion: '2.150.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.7.0',
  name: 'tailscale-lambda-extension',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/rehanvdm/tailscale-lambda-extension.git',
  prettierOptions: {
    settings: {
      printWidth: 120,
      useTabs: false,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      bracketSpacing: true,
      trailingComma: TrailingComma.ES5,
      arrowParens: ArrowParens.ALWAYS,
    },
  },
  pullRequestTemplate: false,
  githubOptions: {
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ['feat', 'fix', 'docs', 'ci', 'chore'],
      },
    },
  },
  workflowNodeVersion: '20',
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['husky'], /* Build dependencies for this module. */
  publishToPypi: {
    distName: 'tailscale_lambda_extension',
    module: 'tailscale_lambda_extension',
  },
});
project.package.addEngine('node', '~20.*');
project.package.addEngine('npm', '~10.*');

// Only run husky if not in CI, in the post install script
project.package.setScript('prepare', 'if [ "$CI" = "true" ]; then echo "CI detected, not running husky"; else husky; fi');

project.gitignore.addPatterns('.idea');
project.gitignore.addPatterns('*.js');
project.gitignore.addPatterns('*.d.ts');
project.gitignore.addPatterns('*.DS_Store');

project.compileTask.exec('cp -r src/tailscale-extension/extensions lib/tailscale-extension/extensions');

project.synth();