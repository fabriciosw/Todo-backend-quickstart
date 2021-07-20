pipeline {

  agent {
    label 'kubernetes'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr:'10'))
    timeout(time: 10, unit: 'MINUTES')
    ansiColor('xterm')
  }

  environment {
    KEY = sh (
          script: "find_jira_key",
          returnStdout: true
        ).trim()
    BRANCH="${env.GERRIT_BRANCH}"
  }


  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm i'
      }
    }
    stage('Quality Gate') {
      steps {
        // sh "npm run lint"
        // sh "npm run test"
      }
    }

    stage('Build project') {
      steps {
        sh "npm run build"
      }
    }

    // TODO: outros stages

  }
}
