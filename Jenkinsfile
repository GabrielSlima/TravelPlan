pipeline {
    agent any
    notify('A pipeline just started')
    def mvnHome
   try {
        // stage('Clone git project - Production Environment') {
        //     sh 'git config --global http.sslverify false'
        //     git branch: '<PROJECT_BRANCH>',
        //     credentialsId: '<JENKINS_NETWORK_USER_CREDENTIAL_ID>',
        //     url: '<PROJECT_REPOSITORY>' 
        //     mvnHome = tool 'Maven3'
        // }
        
        stages {
            stage('Build application') {
                withEnv(["MVN_HOME=$mvnHome"]){
                    //    sh '"$MVN_HOME/bin/mvn" clean org.jacoco:jacoco-maven-plugin:prepare-agent install -Dmaven.test.failure.ignore=false'
                    sh 'echo \'BUILD APPLICATION\''
                }
            }
                
            stage('Deploy application') {
                    sh 'echo RUN SCRIPT TO DEPLOY OUR APPLICATION'
            }
        }
       notify("BUILD SUCCESS")
   }
   catch (error) {
    notify("BUILD FAILURE: ${error}")
    currentBuild.result = 'FAILURE'
   }
}

def notify(status) {
    // emailext body:"""<p>${status}: Job ${env.JOB_NAME} release-${env.BUILD_NUMBER}</p>
    // <p> Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} release-${env.BUILD_NUMBER}</a></p>
    // """,
    // recipientProviders: [developers()],
    // subject: "${status}: Job '${env.JOB_NAME} release-${env.BUILD_NUMBER}'",
    // to: "${env.EMAIL_RECIPIENTS}"

    sh 'echo \'Emails enviados\''
}
