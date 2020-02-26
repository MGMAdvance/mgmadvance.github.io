---
layout: post
title:  "Automatizando a compilação do C++ com Shell Script"
image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=720'
date:   2020-02-10 10:31:46
tags:
- Shell Script
- C++
- Automatização
description: 'Experimentando Shell Script para automatizar a compilação de múltiplos arquivos C++'
categories:
- Shell Script
---
<img src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=720" alt="Imagem de destaque">

## E la vamos nós

Bom, estava aqui viajando moscando olhando pro meu monitor até que tive uma ideia, por que não automatizar os arquivos da minha aula de estrutura de dados?

Para começar, existem diversas soluções para automatizar um deles é criar um [Makefile](https://pt.wikibooks.org/wiki/Programar_em_C/Makefiles), ou até usar um Task Runner como [Gulp](https://gulpjs.com/) que são opções totalmente válidas, porém... eu queria brincar com Shell Script, então resolvi que seria um script simples.

## Começando

### Requisitos para reproduzir esse script
- Bash (Recomendo utilizar OSX ou Linux, mas no Windows da pra utilizar o MSYS2 ou Ubuntu on Windows);
- G++ ou algum outro compilador de C++;
- Paciência.

Vamos identificar o problema, primeiramente todos os arquivos da aula são em C++, eu normalmente separo em pastas para diferenciar de cada aula.

```
.
├── aula_01
│   ├── 01_world.cpp
│   ├── a.out
│   └── world
├── aula_02
│   ├── 02_1-inverso.cpp
│   ├── 02_2-iguais.cpp
│   ├── 02_3-inveter-char.cpp
│   ├── a.out
│   └── test.cpp
└── teste
    ├── a.out
    └── teste.cpp

```
Eu estava pensando como iria fazer isso usando o Shell, até que pensei se o próprio compilador que eu utilizo tinha alguma função recursiva que no caso é o G++, adiantando a resposta, não, porém isso não nos impede de nada, pois uma breve pesquisa no Google achei no [Stackoverflow](https://stackoverflow.com/questions/28345292/gcc-compiler-compile-multiple-files-with-different-output-file-names).

```sh
for i in *.cpp; do g++ $i -o `basename $i .cpp`; done
```

Rodei no terminal e foi perfeitinho, agora vamos trabalhar em cima disso... AH! Sim, valeu! [prajmus](https://stackoverflow.com/users/1170333/prajmus) pela resposta no Stackoverflow!

## Botando a mão na massa

Basicamente só essa linha já quase fazia o que eu queria, só modificar o `*.cpp` para `./*/*.cpp`, quem não está familiarizado com isso, relaxa é bem simples.

- O `.` quer dizer que é aqui o ponto de partida, a sua raiz, o local aonde está sendo executado o script.
- `/*` significa todas as pastas (O `*` significa todos e o `/` diretório).
- `*.cpp` todos os arquivos que tenha `.cpp` no final.

Testei e funcionou perfeitamente, agora vamos dar um tapa nesse script agora, pensei no que eu poderia fazer e resolvi colocar todos os arquivos compilados em uma pasta `output` (faria mais sentido ser `outputs`, mas nem pensei na hora). Criei essa pasta e alterei o `basename $i .cpp` para ``` `./output/`basename $i .cpp` ``` (eu pensei em fazer o script criar a pasta, caso não existisse, mas... eu já tinha terminado o script inteiro.), fazendo assim o a linha ficar: 

```sh
for i in ./*/*.cpp; do g++ $i -o ./output/`basename $i .cpp`; done
```

Linha testada, agora vamos criar um arquivo `.sh`, o nome tanto faz botei `compile.sh`, mas já fica avisado que só consegui rodar o script alterando as permissões dele com `chmod 777 ./compile.sh`, não recomendo força permissões no Linux, mas se você souber alguma outra forma sem ter que fazer isso fique a vontade em comentar.

## Estruturando o script

Vamos aumentar a complexidade (na verdade, nem tanto assim, mas só pra der um charme), pensei em criar um feedback do que está rolando, adicionei um `echo`, porém ainda queria informar se o script tivesse sobrescrevendo algum arquivo já compilado, algo bem simples. Para verificar se o arquivo é existente utilizaremos o `-f` na condição lógica, ele nos retornará um `boolean`, e com isso ele ficará assim:

```sh
    for i in ./*/*.cpp; do \
        if [ -f ./output/`basename $i .cpp` ] 
        then
            g++ $i -o ./output/`basename $i .cpp`; \
            echo "[COMPILE] Overwriting" `basename $i .cpp`; \
        else
            g++ $i -o ./output/`basename $i .cpp`; \
            echo "[COMPILE] Created" `basename $i .cpp`; \
        fi
    done
```
O `\` é usado para pular linha no terminal, porém não tenho certeza se precisa utiliza-lo em um arquivo `.sh` (provavelmente não), mas por via das dúvidas, ele ta ai.

Bem simples não? agora quero adicionar mais algumas coisas, primeiramente eu queria que após a compilação, eu escolhesse um arquivo e executar ele, mas deixa isso pra próxima versão do script (junto com a criação da pasta).

Enfim, coloquei o grandioso `while true` na parada só para fazer um menu, existe outros recursos para fazer isso via terminal, até com opção gráfica via terminal (grande exemplo o **Dialog**), porém não queria perder muito tempo para fazer isso, talvez quem saiba no futuro.
```sh
while true;
do
    clear

    for i in ./*/*.cpp; do \
        if [ -f ./output/`basename $i .cpp` ] 
        then
            g++ $i -o ./output/`basename $i .cpp`; \
            echo "[COMPILE] Overwriting" `basename $i .cpp`; \
        else
            g++ $i -o ./output/`basename $i .cpp`; \
            echo "[COMPILE] Created" `basename $i .cpp`; \
        fi
    done

    echo " ";
    echo "Do you want recompile again? (Y/n) ";
    read forFalse;

    if [ $forFalse == "n" ]
    then
        break;
    fi
done
```

Ele ficou desse jeito, o `read` é para fazer o usuário digitar, e o `break` para finalizar o loop eterno. Eu gosto de fazer meus códigos em inglês por costume, eu consumo muito conteúdo em inglês, incluindo as documentações e gosto também porque assim eu treino a minha escrita.

PRÓXIMO!

Implementei uma espécie de feedback de alteração, ou era pra ser isso.

```sh
echo " ";
echo "Terminated the compilation...";
echo " ";

((out=1))
for i in ./output/*; do \
    echo $out " - " `basename $i`; \
    ((out++))
done

echo " ";
echo "This is all files have compiled...";
```

O `((variavel++))` foi uma alternativa que achei para incrementar a variável.

## Resultado 

<span class="embed-center"><script id="asciicast-305018" src="https://asciinema.org/a/305018.js" async></script></span>

Um script bem simples e divertido de ser fazer, é bem interessante aprender Shell caso você queira automatizar ou facilitar tua vida, principalmente em ambientes Linux ou Mac. 
Especialmente se você mexer em servidores, por exemplo, já fiz um script para o meu servidor de Minecraft, quando início a instância no Google Cloud ele automaticamente abre o servidor de Minecraft em background usando o `screen`, isso é perfeito pois não preciso acessar pelo SSH para iniciar o servidor e caso eu precise fazer alguma coisa no servidor o servidor do jogo está rodando em background e não me impedindo de utilizar o terminal, a mesma coisa se aplica quando eu desligo a instancia, ele roda uma script que salva o mapa e desliga o servidor.

Caso você queria clonar esse script só [clicar aqui!](https://gist.github.com/MGMAdvance/c857c53815a8957b14118ae7fd4c08fe)

***

Se você leu até aqui, gostaria de agradece-lo, qualquer coisa alguma crítica, opinião e correção, fica a vontade em usar os comentários .

***

### Referências
- [Stackoverflow - GCC Compiler: Compile Multiple files with different output file names](https://stackoverflow.com/questions/28345292/gcc-compiler-compile-multiple-files-with-different-output-file-names)
- [Stackoverflow - How to increment a variable in bash?](https://askubuntu.com/questions/385528/how-to-increment-a-variable-in-bash)
- [Shell Script - Parte 2 - Controle de Fluxo](http://blog.evaldojunior.com.br/aulas/blog/shell%20script/2011/05/08/shell-script-parte-2-controle-de-fluxo.html)