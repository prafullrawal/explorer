node -v
if node -v != ""
then
        echo "Node is already installed"
else
        curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
        sudo apt-get install -y nodejs
        node -v
fi
if npm -v != ""
then
        echo "Npm is lready installed"
else
        sudo apt install npm
        npm -v
fi
docker -v
if docker -v != ""
then
        echo "Docker is already installed"
else
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        sudo apt-get update
        apt-cache policy docker-ce
        sudo apt-get install -y docker-ce
        docker -v
fi
docker-compose -v
if docker-compose -v != ""
then
        echo "docker-compose is already installed"
else
        sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        docker-compose --version
fi
if python --version != ""
then
        echo "python is already installed"
else
        sudo apt-get install build-essential checkinstall
        sudo apt-get install libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev
        version=2.7.13
        wget https://www.python.org/ftp/python/$version/Python-$version.tgz
        tar -xvf Python-$version.tgz
        cd Python-$version
        ./configure
        make
        sudo checkinstall
fi

if go version != ""
then
        echo "Go is already installed"
else
        sudo curl -O https://storage.googleapis.com/golang/go1.13.6.linux-amd64.tar.gz
        sudo tar -xvf go1.13.6.linux-amd64.tar.gz
        sudo mv go /usr/local
        export PATH=$PATH:/usr/local/go/bin
        go version
fi

