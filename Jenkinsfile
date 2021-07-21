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

    stage('Build project') {
      steps {
        sh "npm run build"
      }
    }

    // TODO: outros stages

    stage('Build Docker image') {
      steps {
        sh "docker build -t quickstart/node-typescript-api:${env.BRANCH} ."
        sh "docker tag quickstart/node-typescript-api:${env.BRANCH} registry.softdesign-rs.com.br/quickstart/node-typescript-api:${env.BRANCH}"
        sh "docker push registry.softdesign-rs.com.br/quickstart/node-typescript-api:${env.BRANCH}"
      }
    }

    stage('Prepare deploy files') {
      steps {
        sh 'envsubst "\${BRANCH}" < k8s/api-deployment.yaml > deploy/api-deployment-branch.yaml'
        sh 'envsubst "\${BRANCH}" < k8s/api-ingress.yaml > deploy/api-ingress-branch.yaml'
        sh 'envsubst "\${BRANCH}" < k8s/api-service.yaml > deploy/api-service-branch.yaml'
        sh 'kubectl create -f deploy/'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl create -f ./api-service-branch.yaml'
        sh 'kubectl create -f ./api-ingress-branch.yaml'
        sh 'kubectl create -f ./api-deployment-branch.yaml'\
      }
    }
  }
}
