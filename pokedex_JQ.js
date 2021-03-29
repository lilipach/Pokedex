$(document).ready(function(){
    fillDex();

    $("#searchForm").submit(function(event){
        let formData = $("#searchInput").val();
        findPokemon(formData);
        event.preventDefault();
    });
});

function onClickHandle(){
    $(".pokemon").unbind().click(function(){
        let name = $(this).find(" .name").text().toLowerCase();
        console.log(name);
        $.get(`https://pokeapi.co/api/v2/pokemon/${name}`, function(pokemon){
            makePokemonSummary(pokemon, "pokemonBox");
        });
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });
}

function fillDex(){
    //region will mark location where pokemon card will be place/displayed
    for(i = 1; i <=898; i++){
        let region = "";
        if(i<=151)
            region = "Kanto";            
        else if(i > 151 && i <= 251)
            region = "Johto";
        else if(i > 251 && i <= 386)
            region = "Hoenn";
        else if(i > 386 && i <= 493)
            region = "Sinnoh";
        else if(i > 493 && i <= 649)
            region = "Unova";
        else if(i > 649 && i <= 721)
            region = "Kalos";
        else if(i > 721 && i <= 809)
            region = "Alola";
        else if(i > 809)
            region = "Galar";
       
    //make pokemon display card in correct region        
    $.get(`https://pokeapi.co/api/v2/pokemon/${i}`, function(pokemon){
        makePokemonCard(pokemon, region);
        onClickHandle();
    });
   }
}

function makePokemonCard(pokemon, region){
    let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    let frontImage = pokemon.sprites.other["official-artwork"].front_default;
    let typeString = "";
    let description = "";
    $.get(pokemon.species.url, function(species){
        description = species.flavor_text_entries[0].flavor_text;
        description = description.replace("", " ");

        for(i = 0; i < pokemon.types.length; i++){
            typeString = typeString + `<div class="abilityBox ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</div>`
        }
    
        $(`#${region}`).append(
            `<div class="card my-2 pokemon" style="width: 18rem;">`+
                `<img class="card-img-top" src="${frontImage}" alt="Card image cap">`+
                `<div class="card-body">` +
                    `<h4 class="name">${name}</h4>` +
                    `<div class="abilities">${typeString}</div>` + 
                    `<p class="card-text">${description}</p>` +
                `</div>` +
            `</div>`
        );            
    });
}

function findPokemon(pokemon){
    pokemon = pokemon.toLowerCase();
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
        type: 'GET',
        success: function(data){
            makePokemonSummary(data, "pokemonBox");
        },
        error: function() {
            alert(`Sorry could not find ${pokemon}`);
        }
    });
}

function makePokemonSummary(pokemon, location){
    let name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    let frontImage = pokemon.sprites.other["official-artwork"].front_default;
    let weight = pokemon.weight;
    let typeString = "";
    let description = "";
    let dim = $(document).width()/3;

    let stats = getStats(pokemon.stats);

    $.get(pokemon.species.url, function(species){
        description = species.flavor_text_entries[0].flavor_text;
        description = description.replace("", " ");

        for(i = 0; i < pokemon.types.length; i++){
            typeString = typeString + `<div class="abilityBox ${pokemon.types[i].type.name}">${pokemon.types[i].type.name}</div>`
        }
    
        $(`#${location}`).text(""); //clean previous search
        $(`#${location}`).append(
            `<div class="d-flex">` +
              `<img style="max-width: ${dim}px; max-height: ${dim}px;" src="${frontImage}" alt="pokemon">` +
            `</div>` +
            `<div class="jumbotron d-flex flex-column w-100 p-4">` +
                `<h6 class="lead name" style="font-size: 50px;"> ${name}</h6>` + 
                `<div class="d-flex my-2" class="abilities"> ${typeString}</div>` + 
                    `<table class="lead table">` + 
                        `<tbody>` +
                            `<tr>` +
                                `<th class="w-25" scope="row"> Description: </th>` +
                                `<td class="w-75" style="word-wrap: break-word;min-width: 160px;max-width: 160px;"> ${description}</td>` +
                            `</tr>` +
                            `<tr>` +
                                `<th scope="row"> Weight: </th>` +
                                `<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">${weight} </td>` +
                            `</tr>` +
                            `<tr>` +
                                `<th scope="row"> Base Stats: </th>`+
                                `<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">${stats} </td>` +
                            `</tr>` +
                        `</tbody>` +
                    `</table>` +
            `</div>`
        );
    });   
}

function getStats(statsArr){
    let statsString = "";
    for(i = 0; i< statsArr.length; i++){
        if(i === 0)
            statsString = statsString + `<div class="d-flex"><div class="d-flex flex-column" style="margin-right: 50px;"> <p>${statsArr[i].stat.name}: ${statsArr[1].base_stat}<p>\n`;
        else if(i === 3)
            statsString = statsString + `</div><div class="d-flex flex-column"> <p>${statsArr[i].stat.name}: ${statsArr[1].base_stat}<p>\n`;
        else
            statsString = statsString + `<p>${statsArr[i].stat.name}: ${statsArr[1].base_stat}<p>\n`;        
    }
    statsString = statsString + "</div></div>";
    return statsString ;
}
