---
layout: post
title:  "Como criar um servidor de Minecraft no Google Cloud"
image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=720'
date:   2020-03-29 09:00:46
tags:
- Cloud
- Shell Script
- Servidor
description: 'Criando uma instância no Google Cloud para utilizar como servidor de Minecraft'
categories:
- Cloud
---
<img src="https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=720" alt="Imagem de destaque">

## A ideia

Já pensou em rodar o seu servidor no Google Cloud ou até mesmo em outro Cloud tipo AWS? pode parecer difícil no começo, mas é simples, o que dificulta mesmo é a quantidade de informações espalhadas e serviços que a Cloud oferece, porém no final o princípio é praticamente o mesmo, uma VM rodando a sua aplicação (claro que não se resume a isso).

Nesse caso vamos apenas utilizar o Computer Engine (Seria equivalente a um EC2 da AWS), configurar a Rede e o Firewall, assim podendo expor o nosso servidor para os jogadores.

### Requisitos para replicar
- Uma conta Google para usar o Google Cloud (Até a data de publicação desse artigo, a GCP fornece $300 de créditos gratuitamente por 1 ano);
- Saber utilizar algumas funcionalidades pelo Terminal.

Caso você queria ver a solução feita pela Google para implementar o servidor de Minecraft [veja aqui](https://cloud.google.com/solutions/gaming/minecraft-server?hl=pt-br), além de ter outro exemplos de aplicação em cloud, o que pretendo é simplificar a solução deles, pois pretendo utilizar apenas entre meus amigos.

## Antes de começar

Gostaria de falar uma coisa bem importante, preço, caso você não for utilizar o **nível gratuito**, fique atento ao custo de **TUDO**, a Google fornece ferramentas para alerta-lo sobre o orçamento e afins, você pode utilizar a [calculadora de preços](https://cloud.google.com/products/calculator) que é bem intuitivo se comparado com algumas outras do mercado, também tem a [tabela de preços](https://cloud.google.com/pricing/list?hl=pt-br).

Ele utiliza seu cartão de crédito para fazer a cobrança, então fique precavido, caso faça alguma besteira...

Caso você está utilizando o **nível gratuito** ou a promoção de 1 ano, fique tranquilo!

## Bora começar!

Primeiro de tudo, no GCP (Google Cloud Platform) você deverá criar um projeto, provavelmente caso você não tenha nenhum eles devem pedir para você criar um, caso você já tenha, mas queria criar outro, vá no canto superior ao lado da logo da GCP e clique no nome do teu projeto atual:

![GCP Projetos](https://i.imgur.com/DxrS8IZ.png)

Depois clique em `Novo projeto`:

![GCP Novo projeto](https://i.imgur.com/z0yISyD.png)

Vou criar um projeto chamado **meumine**:

![GCP Meu Mine](https://i.imgur.com/6dVaDva.png)

> Lembre-se que a Google pode trocar a posição dos menus conforme o tempo.

## Criando nossa VM com Computer Engine

Após ter criado o projeto, vamos criar uma instância pelo [Computer Engine](https://console.cloud.google.com/compute/instances), você pode utilizar o campo de pesquisa e procurar por ele, ou ir no menu lateral no grupo Computação vai está lá Computer Engine:

![GCP Compute Engine](https://i.imgur.com/ySdaaWI.png)

Indo para **Computer Engine** escolha **Instâncias de VM**, assim caso você não tenha **nenhuma** instância no seu projeto irá aparecer algo do tipo:

![GCP Crie VM](https://i.imgur.com/S5GhkIF.png)

Sinta-se livre de escolher entre **Criar** ou **Usar o inicio rápido** (que na verdade é um tutorial sobre as instância). Irei escolher **Criar**, simples e objetivo.

Após isso você deve ver algo do tipo:

![GCP VM](https://i.imgur.com/6VbiIV0.png)

MUITA INFORMAÇÃO!? Relaxa, é bem simples.

Na **esquerda** ele te da opções de criar uma nova VM, importa VM, criar uma VM com base de uma imagem de alguma outra VM que já existe e utilizar o Marketplace (que tem muita coisa boa e pronta, exemplo VM pronta para rodar Wordpress, Node e etc), vamos permanecer na opção padrão.

![GCP Preço](https://i.imgur.com/BcqqVzP.png)

Na **direita** temos os valores da VM, que? isso mesmo, caso você não esteja acostuma com cloud, diferente de uma hospedagem compartilha ou dedicada (ex.: HostGator) que tem pacotes com valores fixos, em Cloud isso é diferente, você paga pelo que usar, exemplo é nessa imagem numa VM com uma vCPU e 3,75 GB de RAM, irei pagar **$0,034/hora**, essa é outra diferença de uma Cloud, a sua cobrança por hora.

Se eu quiser alterar a configuração?

Ai que tá! podemos usar os pacotes pré-definidos pela Google por exemplo o `n1-standard`, sinta-se livre de escolher a configuração para sua VM.

**UM AVISO!!!** caso você queria usar o nível gratuito (sem a promoção de um ano da Google), veja se a região da sua maquina está como `us-central1 (lowa)` e tipo de maquina `f1-micro`, mas lembre-se que sempre é bom verificar no site qual é a região e tipo de maquina que continua sendo gratuito.

Quer uma maquina personalizada? clique em **Tipo de maquina** e vai em **Personalizado**, ai o resto é com você amigão!

### Disco e sistema

![GCP Disco](https://i.imgur.com/LG8ql2a.png)

Nessa etapa vária, o Debian sem dúvidas é a melhor opção pela sua estabilidade, porém, tenho preferencia ao Ubuntu, mas sinta-se livre de escolher outro sistema do seu gosto.

![GCP Escolha sua distro](https://i.imgur.com/LlYtg2p.png)

Clique em **Alterar**, altere o **Sistema operacional** para qual você se sentir mais confortável, eu irei escolher o **Ubuntu** e sua versão **18.04 LTS**, sempre se foque nas versões **LTS (Long-Term Support)**, pois são mais estáveis e terão atualizações de seguranças por um período entre 4 anos.

No final será um Ubuntu 18.04 LTS com 10GB de HD.

![GCP Firewall](https://i.imgur.com/6NrdAuL.png)

Libere o acesso **HTTP** e **HTTPS** para adiantar nosso processo.

> Veja se você alterou a nome da instância para identifica-la melhor.

## Modificando a Rede

![Configurar rede](https://i.imgur.com/zhtIxt9.png)

Clique em **Gerenciamento, segurança, discos, rede, locatário único**.

Irá aparecer um menu enorme, bom, clique em **Redes**, em **Tags de Rede** adicione alguma coisa por exemplo eu coloquei **meu-server**, mas coloque o que quiser.

![Tags de Rede](https://i.imgur.com/cA3IAod.png)

Logo após, vá em **Interface da Rede**, e agora iremos atribuir um **IP estático** para nosso servidor... e porque? Imagine que você e seus amigos queiram jogar e toda vez que iniciar o servidor o IP irá mudar, fica chato ter que pegar o IP toda vez que ele muda não é? Então em **IP Externo** escolha **Criar endereço de IP** e coloque um nome para ele.

![Criando IP](https://i.imgur.com/oJswNkb.png)

O nome é apenas para identificar, ele **não é seu IP**!

Já o **Nível de serviço da rede** ele é um diferencial para velocidade (ex.: ping), mas isso pesa no preço final também, o **Premium** utiliza a infra da Google para entregar uma conexão de alta performance entre os servidores e os clientes, o **Padrão** utiliza a infra padrão que é a basicamente a internet que utilizamos para nos conectamos.

Clique em **Reservar**.

![Meu ip](https://i.imgur.com/dgEgUCX.png)

Esse será meu novo IP estático **35.209.94.89**, após isso clique em **Concluído**.

**Verifique se está tudo certo!**

Agora pressione **Criar**.

## Configurar Firewall

Vamos criar uma regra no [Firewall](https://console.cloud.google.com/networking/firewalls), é o mesmo esquema do Compute Engine, pode procurar Firewall na busca do GCP ou ir no menu e procurar por **Rede VPC** e no sub-menu **Regras de Firewall**.

Pressione **Criar regra de Firewall**.

- **Nome**, bote um nome para identificar a regra que você vai criar;
- **Descrição**, não é obrigatório, mas se você quiser, bota algo objetivo;
- **Tags de destino**, lembra daquela **Tag de Rede** que criamos? Use ela aqui;
- **Intervalos de IP de Origem**, devemos por `0.0.0.0/0` para liberar acesso a todos;

Devemos liberar a porta para os clientes do Minecraft, então:

![Porta padrão](https://i.imgur.com/iwkK6tJ.png)

Habilite o **TCP** e libere a porta **25565** (no caso é a porta padrão do Minecraft), caso queira usar outra porta sinta-se livre, porém lembre-se de alterar no servidor o `port` no `server.properties`.

## Conectar na VM

Regra criada! Bora entrar na nossa VM, mas antes, eu recomendo você utilizar o SSH via terminal, a Google tem uma [página](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys?hl=pt-br) só para isso, basicamente é rodar `ssh-keygen`, acessa a configurações da sua instância (Obs.: ela tem que está desligada para efetuar alterações), e inserir sua chave pública de SSH nela.

Porém... para não deixar maior ainda, vamos utilizar o terminal via browser da Google, basta clicar em **SSH**:

![SSH](https://i.imgur.com/IU8hPlj.png)

Caso queira usar um outro cliente SSH, use o seu IP externo para acessar a maquina.

![Browser](https://i.imgur.com/fW0rvni.png)

Pronto! estamos conectados na VM.

## Hora de instalar!

Você pode utilizar o local aonde seu usuário se encontra e baixar o servidor de Minecraft e usar ou criar uma pasta em algum outro local e criar um ponto de montagem.

Vamos ficar aonde estamos mesmo e apenas criar uma pasta chamada `minecraft ` e logo após entrar nela:

```bash
mkdir minecraft && cd minecraft
```

Agora iremos atualizar o nosso Ubuntu:

```bash
sudo apt update && sudo apt upgrade
```

Perfeito!

A VM vem limpa então vamos instalar o que precisamos... e o que precisamos?

- Java 8, para rodar o servidor de Minecraft;
- Screen, para usar o servidor de Minecraft em background (explico depois).

Vamos rodar esse comando:
```bash
sudo apt install openjdk-8-jre-headless screen
```

### Escolha sua arma

Você decide nesse momento qual o servidor utilizar, as opções mais comuns é utilizar o **Minecraft Server** (Oficial da Mojang) ou CraftBukkit (Que possibilita utilizar plugins), caso queira utilizar mods, recomendo utilizar o Forge, mas com mods é um pouco mais complexo comparado com esse, mas nada impossível.

Lembre-se estamos em uma VM e usamos tudo via terminal, então baixar no teu computador e arrastar não vai dar em nada, iremos utilizar o comando `wget` para baixar, então tenha certeza que o link que vai utilizar seja do arquivo `.jar` do servidor.

> Os comandos estão com os links do Minecraft 1.15.2, então caso queira outra versão é só substituir pela versão desejada.

Você quer utilizar o [Minecraft Server](https://www.minecraft.net/pt-br/download/server/)?
```bash
wget https://launcher.mojang.com/v1/objects/bb2b6b1aefcd70dfd1892149ac3a215f6c636b07/server.jar
```

Você quer utilizar o [CraftBukkit](https://getbukkit.org/download/craftbukkit)?
```bash
wget https://cdn.getbukkit.org/craftbukkit/craftbukkit-1.15.2.jar
```

### Iniciar o servidor

Um aviso antes, tanto faz qual servidor que você escolheu, a primeira vez ele só irá gerar um arquivo EULA.txt para você aceitar os tempos.

> Os parâmetros Xms e Xmx podem ser alterados como desejar. 

Caso esteja usando o Minecraft Server:
```bash
java -Xms1G -Xmx3G -jar server.jar nogui
```
> Nota: o Minecraft Server precisa o `nogui` para funcionar

Caso esteja usando o CraftBukkit:
```bash
java -Xms1G -Xmx3G craftbukkit-1.15.2.jar
```

Depois disso deve aparecer algo do tipo:

```bash
[10:47:24] [main/ERROR]: Failed to load properties from file: server.properties
[10:47:25] [main/WARN]: Failed to load eula.txt
[10:47:25] [main/INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
```

> Se estiver usando o CraftBukkit, ele pode mostrar um pouco diferente e até falar que está out-of-date, mas relaxa.

Agora você deve aceitar os termos dentro do `eula.txt`:
```bash
nano eula.txt
```

Bote como `true`:
```bash
eula=true
```

Como sair do editor de texto? Use `Ctrl+O` e dê `enter` para salvar o arquivo, depois `Ctrl+X` para sair do editor.

Agora vamos editar o `server.properties`, o que devemos alterar nele?
- online-mode, caso você queira jogadores que não tenha o Minecraft original coloque como `false`;
- server-ip, coloque o IP interno da sua VM, fica no lado esquerdo da onde você pegou o IP externo;

Caso queria botar uma porta personalizada só modificar o `query.port`, mas lembre-se que deve alterar a regra de firewall para permitir acesso a essa porta.

O outros atributos é melhor checar no fórum do Minecraft, mas alguns já dizem de cara o que fazem, por exemplo `level-name`.

Para editar o `server.properties`:
```bash
nano server.properties
```

Edite os atributos que eu falei lá em cima... e faça o mesmo procedimento que você fez com o `eula.txt`.

**BORA RODAR!** rode o servidor do minecraft novamente, só que dessa vez caso tenha feito tudo certo, ele vai carregar e gerar o mapa (isso demora um tempo).

Como jogar com teus amigos? Só pegar o IP externo da sua VM + a porta do seu servidor de Minecraft

![IP Externo](https://i.imgur.com/LD241px.png)

Exemplo: 35.230.78.42:25565

## Rodar em background

Você já tem um servidor de minecraft no Google Cloud, porém tem um problema, o momento que você sair do terminal o servidor vai fechar e também se você quiser fazer outra coisa na VM não vai da, por que? O servidor vai está em primeiro plano então vai ocupar o teu terminal, mas tem uma solução para isso.

Lembra que falei do **Screen**? Ele serve exatamente pra isso, vamos usar ele para deixar o servidor em background.

Tem duas formas, uma é utilizar `Ctrl+A` e depois pressionar `d` que ele faz um detach no servidor deixando ele em background, a segunda forma é
```bash
screen -S mine java -Xms1G -Xmx3G -d64 -jar server.jar nogui
```
O que está acontecendo nessa linha?

```bash
screen -S <nome-do-seu-processo> <comando-para-ficar-em-background>
```

Quero voltar pro servidor para fazer umas alterações, o que faço?
```bash
screen -r mine
```
Basicamente:
```bash
screen -r <nome-do-seu-processo>
```

## Automatizar a VM

Com uma leve preguiça de ter que entrar na VM e subir o servidor? Só rode um script!

Com a VM desligada, pressione em cima do nome dela, nisso você vai entrar na página de **Detalhes da instância de VM**, clique em **Editar**.

Procure por **Metadados personalizados** e nele adicione na Chave `startup-script` e no seu Valor:
```bash
#!/bin/bash
sudo screen -d -m -S <nome-do-processo> <comando-do-servidor>
```
Então quando você ligar a instância o servidor irá subir o Minecraft automaticamente.

E para desligar adicione na Chave `shutdown-script` e no Valor:
```bash
#!/bin/bash
sudo screen -r <nome-do-processo> -X stuff '/stop\n'
```

Deve ficar algo próximo assim:
![Metadados](https://i.imgur.com/E13GfKO.png)

---

### Muito obrigado!
Foi um texto beeeem longo, então se tiver algo para acrescentar ou até mesmo corrigir, fique à vontade em usar a seção de comentários.

---

### Referência
- [Google Cloud: Soluções](https://cloud.google.com/solutions/gaming/minecraft-server?hl=pt-br)
- [Google Cloud: SSH](https://cloud.google.com/compute/docs/instances/adding-removing-ssh-keys?hl=pt-br)
- [Google Cloud Calculator](https://cloud.google.com/products/calculator?hl=pt-br)